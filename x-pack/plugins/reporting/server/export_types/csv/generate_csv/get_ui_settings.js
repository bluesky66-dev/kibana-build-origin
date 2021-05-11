"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getUiSettings = async (timezone, client, config, logger) => {
  // Timezone
  let setTimezone; // look for timezone in job params

  if (timezone) {
    setTimezone = timezone;
  } else {
    // if empty, look for timezone in settings
    setTimezone = await client.get('dateFormat:tz');

    if (setTimezone === 'Browser') {
      // if `Browser`, hardcode it to 'UTC' so the export has data that makes sense
      logger.warn(_i18n.i18n.translate('xpack.reporting.exportTypes.csv.executeJob.dateFormateSetting', {
        defaultMessage: 'Kibana Advanced Setting "{dateFormatTimezone}" is set to "Browser". Dates will be formatted as UTC to avoid ambiguity.',
        values: {
          dateFormatTimezone: 'dateFormat:tz'
        }
      }));
      setTimezone = 'UTC';
    }
  } // Separator, QuoteValues


  const [separator, quoteValues] = await Promise.all([client.get(_constants.UI_SETTINGS_CSV_SEPARATOR), client.get(_constants.UI_SETTINGS_CSV_QUOTE_VALUES)]);
  return {
    timezone: setTimezone,
    separator,
    quoteValues,
    escapeFormulaValues: config.get('csv', 'escapeFormulaValues'),
    maxSizeBytes: config.get('csv', 'maxSizeBytes'),
    scroll: config.get('csv', 'scroll'),
    checkForFormulas: config.get('csv', 'checkForFormulas')
  };
};

exports.getUiSettings = getUiSettings;