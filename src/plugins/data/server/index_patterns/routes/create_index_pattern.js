"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateIndexPatternRoute = void 0;

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
const indexPatternSpecSchema = _configSchema.schema.object({
  title: _configSchema.schema.string(),
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  version: _configSchema.schema.maybe(_configSchema.schema.string()),
  type: _configSchema.schema.maybe(_configSchema.schema.string()),
  timeFieldName: _configSchema.schema.maybe(_configSchema.schema.string()),
  sourceFilters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    value: _configSchema.schema.string()
  }))),
  fields: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _schemas.fieldSpecSchema)),
  typeMeta: _configSchema.schema.maybe(_configSchema.schema.object({}, {
    unknowns: 'allow'
  })),
  fieldFormats: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _schemas.serializedFieldFormatSchema)),
  fieldAttrs: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
    customLabel: _configSchema.schema.maybe(_configSchema.schema.string()),
    count: _configSchema.schema.maybe(_configSchema.schema.number())
  }))),
  allowNoIndex: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

const registerCreateIndexPatternRoute = (router, getStartServices) => {
  router.post({
    path: '/api/index_patterns/index_pattern',
    validate: {
      body: _configSchema.schema.object({
        override: _configSchema.schema.maybe(_configSchema.schema.boolean({
          defaultValue: false
        })),
        refresh_fields: _configSchema.schema.maybe(_configSchema.schema.boolean({
          defaultValue: false
        })),
        index_pattern: indexPatternSpecSchema
      })
    }
  }, router.handleLegacyErrors((0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const savedObjectsClient = ctx.core.savedObjects.client;
    const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
    const [,, {
      indexPatterns
    }] = await getStartServices();
    const indexPatternsService = await indexPatterns.indexPatternsServiceFactory(savedObjectsClient, elasticsearchClient);
    const body = req.body;
    const indexPattern = await indexPatternsService.createAndSave(body.index_pattern, body.override, !body.refresh_fields);
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

exports.registerCreateIndexPatternRoute = registerCreateIndexPatternRoute;