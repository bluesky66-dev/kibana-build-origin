"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGenerateCsv = createGenerateCsv;

var _i18n = require("@kbn/i18n");

var _constants = require("../../../../common/constants");

var _schema_utils = require("../../../../common/schema_utils");

var _services = require("../../../services");

var _check_cells_for_formulas = require("./check_cells_for_formulas");

var _escape_value = require("./escape_value");

var _field_format_map = require("./field_format_map");

var _flatten_hit = require("./flatten_hit");

var _format_csv_values = require("./format_csv_values");

var _get_ui_settings = require("./get_ui_settings");

var _hit_iterator = require("./hit_iterator");

var _max_size_string_builder = require("./max_size_string_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createGenerateCsv(logger) {
  const hitIterator = (0, _hit_iterator.createHitIterator)(logger);
  return async function generateCsv(job, config, uiSettingsClient, callEndpoint, cancellationToken) {
    const settings = await (0, _get_ui_settings.getUiSettings)(job.browserTimezone, uiSettingsClient, config, logger);
    const escapeValue = (0, _escape_value.createEscapeValue)(settings.quoteValues, settings.escapeFormulaValues);
    const bom = config.get('csv', 'useByteOrderMarkEncoding') ? _constants.CSV_BOM_CHARS : '';
    const builder = new _max_size_string_builder.MaxSizeStringBuilder((0, _schema_utils.byteSizeValueToNumber)(settings.maxSizeBytes), bom);
    const {
      fields,
      metaFields,
      conflictedTypesFields
    } = job;
    const header = `${fields.map(escapeValue).join(settings.separator)}\n`;
    const warnings = [];

    if (!builder.tryAppend(header)) {
      return {
        size: 0,
        content: '',
        maxSizeReached: true,
        warnings: []
      };
    }

    const iterator = hitIterator(settings.scroll, callEndpoint, job.searchRequest, cancellationToken);
    let maxSizeReached = false;
    let csvContainsFormulas = false;
    const flattenHit = (0, _flatten_hit.createFlattenHit)(fields, metaFields, conflictedTypesFields);
    const formatsMap = await (0, _services.getFieldFormats)().fieldFormatServiceFactory(uiSettingsClient).then(fieldFormats => (0, _field_format_map.fieldFormatMapFactory)(job.indexPatternSavedObject, fieldFormats, settings.timezone));
    const formatCsvValues = (0, _format_csv_values.createFormatCsvValues)(escapeValue, settings.separator, fields, formatsMap);

    try {
      while (true) {
        const {
          done,
          value: hit
        } = await iterator.next();

        if (!hit) {
          break;
        }

        if (done) {
          break;
        }

        if (cancellationToken.isCancelled()) {
          break;
        }

        const flattened = flattenHit(hit);
        const rows = formatCsvValues(flattened);
        const rowsHaveFormulas = settings.checkForFormulas && (0, _check_cells_for_formulas.checkIfRowsHaveFormulas)(flattened, fields);

        if (rowsHaveFormulas) {
          csvContainsFormulas = true;
        }

        if (!builder.tryAppend(rows + '\n')) {
          logger.warn('max Size Reached');
          maxSizeReached = true;

          if (cancellationToken) {
            cancellationToken.cancel();
          }

          break;
        }
      }
    } finally {
      await iterator.return();
    }

    const size = builder.getSizeInBytes();
    logger.debug(`finished generating, total size in bytes: ${size}`);

    if (csvContainsFormulas && settings.escapeFormulaValues) {
      warnings.push(_i18n.i18n.translate('xpack.reporting.exportTypes.csv.generateCsv.escapedFormulaValues', {
        defaultMessage: 'CSV may contain formulas whose values have been escaped'
      }));
    }

    return {
      content: builder.getString(),
      csvContainsFormulas: csvContainsFormulas && !settings.escapeFormulaValues,
      maxSizeReached,
      size,
      warnings
    };
  };
}