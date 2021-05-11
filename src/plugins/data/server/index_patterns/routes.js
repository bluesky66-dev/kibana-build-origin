"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;

var _configSchema = require("@kbn/config-schema");

var _fetcher = require("./fetcher");

var _create_index_pattern = require("./routes/create_index_pattern");

var _get_index_pattern = require("./routes/get_index_pattern");

var _delete_index_pattern = require("./routes/delete_index_pattern");

var _update_index_pattern = require("./routes/update_index_pattern");

var _update_fields = require("./routes/fields/update_fields");

var _create_scripted_field = require("./routes/scripted_fields/create_scripted_field");

var _put_scripted_field = require("./routes/scripted_fields/put_scripted_field");

var _get_scripted_field = require("./routes/scripted_fields/get_scripted_field");

var _delete_scripted_field = require("./routes/scripted_fields/delete_scripted_field");

var _update_scripted_field = require("./routes/scripted_fields/update_scripted_field");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerRoutes(http, getStartServices) {
  const parseMetaFields = metaFields => {
    let parsedFields = [];

    if (typeof metaFields === 'string') {
      parsedFields = JSON.parse(metaFields);
    } else {
      parsedFields = metaFields;
    }

    return parsedFields;
  };

  const router = http.createRouter(); // Index Patterns API

  (0, _create_index_pattern.registerCreateIndexPatternRoute)(router, getStartServices);
  (0, _get_index_pattern.registerGetIndexPatternRoute)(router, getStartServices);
  (0, _delete_index_pattern.registerDeleteIndexPatternRoute)(router, getStartServices);
  (0, _update_index_pattern.registerUpdateIndexPatternRoute)(router, getStartServices); // Fields API

  (0, _update_fields.registerUpdateFieldsRoute)(router, getStartServices); // Scripted Field API

  (0, _create_scripted_field.registerCreateScriptedFieldRoute)(router, getStartServices);
  (0, _put_scripted_field.registerPutScriptedFieldRoute)(router, getStartServices);
  (0, _get_scripted_field.registerGetScriptedFieldRoute)(router, getStartServices);
  (0, _delete_scripted_field.registerDeleteScriptedFieldRoute)(router, getStartServices);
  (0, _update_scripted_field.registerUpdateScriptedFieldRoute)(router, getStartServices);
  router.get({
    path: '/api/index_patterns/_fields_for_wildcard',
    validate: {
      query: _configSchema.schema.object({
        pattern: _configSchema.schema.string(),
        meta_fields: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())], {
          defaultValue: []
        }),
        type: _configSchema.schema.maybe(_configSchema.schema.string()),
        rollup_index: _configSchema.schema.maybe(_configSchema.schema.string()),
        allow_no_index: _configSchema.schema.maybe(_configSchema.schema.boolean())
      })
    }
  }, async (context, request, response) => {
    const {
      asCurrentUser
    } = context.core.elasticsearch.client;
    const indexPatterns = new _fetcher.IndexPatternsFetcher(asCurrentUser);
    const {
      pattern,
      meta_fields: metaFields,
      type,
      rollup_index: rollupIndex,
      allow_no_index: allowNoIndex
    } = request.query;
    let parsedFields = [];

    try {
      parsedFields = parseMetaFields(metaFields);
    } catch (error) {
      return response.badRequest();
    }

    try {
      const fields = await indexPatterns.getFieldsForWildcard({
        pattern,
        metaFields: parsedFields,
        type,
        rollupIndex,
        fieldCapsOptions: {
          allow_no_indices: allowNoIndex || false
        }
      });
      return response.ok({
        body: {
          fields
        },
        headers: {
          'content-type': 'application/json'
        }
      });
    } catch (error) {
      var _error$output, _error$output2;

      if (typeof error === 'object' && !!(error !== null && error !== void 0 && error.isBoom) && !!(error !== null && error !== void 0 && (_error$output = error.output) !== null && _error$output !== void 0 && _error$output.payload) && typeof (error === null || error === void 0 ? void 0 : (_error$output2 = error.output) === null || _error$output2 === void 0 ? void 0 : _error$output2.payload) === 'object') {
        var _error$output3;

        const payload = error === null || error === void 0 ? void 0 : (_error$output3 = error.output) === null || _error$output3 === void 0 ? void 0 : _error$output3.payload;
        return response.notFound({
          body: {
            message: payload.message,
            attributes: payload
          }
        });
      } else {
        return response.notFound();
      }
    }
  });
  router.get({
    path: '/api/index_patterns/_fields_for_time_pattern',
    validate: {
      query: _configSchema.schema.object({
        pattern: _configSchema.schema.string(),
        interval: _configSchema.schema.maybe(_configSchema.schema.string()),
        look_back: _configSchema.schema.number({
          min: 1
        }),
        meta_fields: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())], {
          defaultValue: []
        })
      })
    }
  }, async (context, request, response) => {
    const {
      asCurrentUser
    } = context.core.elasticsearch.client;
    const indexPatterns = new _fetcher.IndexPatternsFetcher(asCurrentUser);
    const {
      pattern,
      interval,
      look_back: lookBack,
      meta_fields: metaFields
    } = request.query;
    let parsedFields = [];

    try {
      parsedFields = parseMetaFields(metaFields);
    } catch (error) {
      return response.badRequest();
    }

    try {
      const fields = await indexPatterns.getFieldsForTimePattern({
        pattern,
        interval: interval ? interval : '',
        lookBack,
        metaFields: parsedFields
      });
      return response.ok({
        body: {
          fields
        },
        headers: {
          'content-type': 'application/json'
        }
      });
    } catch (error) {
      return response.notFound();
    }
  });
}