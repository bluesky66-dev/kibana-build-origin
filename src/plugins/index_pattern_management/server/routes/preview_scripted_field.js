"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPreviewScriptedFieldRoute = registerPreviewScriptedFieldRoute;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerPreviewScriptedFieldRoute(router) {
  router.post({
    path: '/internal/index-pattern-management/preview_scripted_field',
    validate: {
      body: _configSchema.schema.object({
        index: _configSchema.schema.string(),
        name: _configSchema.schema.string(),
        script: _configSchema.schema.string(),
        query: _configSchema.schema.maybe(_configSchema.schema.object({}, {
          unknowns: 'allow'
        })),
        additionalFields: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
      })
    }
  }, async (context, request, res) => {
    const client = context.core.elasticsearch.client.asCurrentUser;
    const {
      index,
      name,
      script,
      query,
      additionalFields
    } = request.body;

    try {
      const response = await client.search({
        index,
        _source: additionalFields && additionalFields.length > 0 ? additionalFields : undefined,
        size: 10,
        timeout: '30s',
        body: {
          query: query !== null && query !== void 0 ? query : {
            match_all: {}
          },
          script_fields: {
            [name]: {
              script: {
                lang: 'painless',
                source: script
              }
            }
          }
        }
      });
      return res.ok({
        body: response
      });
    } catch (err) {
      var _err$body;

      return res.customError({
        statusCode: err.statusCode || 500,
        body: {
          message: err.message,
          attributes: {
            error: ((_err$body = err.body) === null || _err$body === void 0 ? void 0 : _err$body.error) || err.message
          }
        }
      });
    }
  });
}