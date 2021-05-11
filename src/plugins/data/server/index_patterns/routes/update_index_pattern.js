"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateIndexPatternRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _handle_errors = require("./util/handle_errors");

var _schemas = require("./util/schemas");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const indexPatternUpdateSchema = _configSchema.schema.object({
  title: _configSchema.schema.maybe(_configSchema.schema.string()),
  type: _configSchema.schema.maybe(_configSchema.schema.string()),
  typeMeta: _configSchema.schema.maybe(_configSchema.schema.object({}, {
    unknowns: 'allow'
  })),
  timeFieldName: _configSchema.schema.maybe(_configSchema.schema.string()),
  intervalName: _configSchema.schema.maybe(_configSchema.schema.string()),
  sourceFilters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    value: _configSchema.schema.string()
  }))),
  fieldFormats: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _schemas.serializedFieldFormatSchema)),
  fields: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _schemas.fieldSpecSchema)),
  allowNoIndex: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

const registerUpdateIndexPatternRoute = (router, getStartServices) => {
  router.post({
    path: '/api/index_patterns/index_pattern/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        })
      }, {
        unknowns: 'allow'
      }),
      body: _configSchema.schema.object({
        refresh_fields: _configSchema.schema.maybe(_configSchema.schema.boolean({
          defaultValue: false
        })),
        index_pattern: indexPatternUpdateSchema
      })
    }
  }, router.handleLegacyErrors((0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const savedObjectsClient = ctx.core.savedObjects.client;
    const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
    const [,, {
      indexPatterns
    }] = await getStartServices();
    const indexPatternsService = await indexPatterns.indexPatternsServiceFactory(savedObjectsClient, elasticsearchClient);
    const id = req.params.id;
    const indexPattern = await indexPatternsService.get(id);
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      refresh_fields = true,
      index_pattern: {
        title,
        timeFieldName,
        intervalName,
        sourceFilters,
        fieldFormats,
        type,
        typeMeta,
        fields
      }
    } = req.body;
    let changeCount = 0;
    let doRefreshFields = false;

    if (title !== undefined && title !== indexPattern.title) {
      changeCount++;
      indexPattern.title = title;
    }

    if (timeFieldName !== undefined && timeFieldName !== indexPattern.timeFieldName) {
      changeCount++;
      indexPattern.timeFieldName = timeFieldName;
    }

    if (intervalName !== undefined && intervalName !== indexPattern.intervalName) {
      changeCount++;
      indexPattern.intervalName = intervalName;
    }

    if (sourceFilters !== undefined) {
      changeCount++;
      indexPattern.sourceFilters = sourceFilters;
    }

    if (fieldFormats !== undefined) {
      changeCount++;
      indexPattern.fieldFormatMap = fieldFormats;
    }

    if (type !== undefined) {
      changeCount++;
      indexPattern.type = type;
    }

    if (typeMeta !== undefined) {
      changeCount++;
      indexPattern.typeMeta = typeMeta;
    }

    if (fields !== undefined) {
      changeCount++;
      doRefreshFields = true;
      indexPattern.fields.replaceAll(Object.values(fields || {}).map(field => ({ ...field,
        aggregatable: true,
        searchable: true
      })));
    }

    if (changeCount < 1) {
      throw new Error('Index pattern change set is empty.');
    }

    await indexPatternsService.updateSavedObject(indexPattern);

    if (doRefreshFields && refresh_fields) {
      await indexPatternsService.refreshFields(indexPattern);
    }

    return res.ok({
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        index_pattern: indexPattern.toSpec()
      })
    });
  })));
};

exports.registerUpdateIndexPatternRoute = registerUpdateIndexPatternRoute;