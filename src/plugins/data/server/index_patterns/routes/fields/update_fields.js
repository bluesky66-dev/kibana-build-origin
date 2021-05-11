"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateFieldsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _handle_errors = require("../util/handle_errors");

var _schemas = require("../util/schemas");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerUpdateFieldsRoute = (router, getStartServices) => {
  router.post({
    path: '/api/index_patterns/index_pattern/{id}/fields',
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
        fields: _configSchema.schema.recordOf(_configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        }), _configSchema.schema.object({
          customLabel: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string({
            minLength: 1,
            maxLength: 1_000
          }))),
          count: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.number())),
          format: _configSchema.schema.maybe(_configSchema.schema.nullable(_schemas.serializedFieldFormatSchema))
        }))
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
    const {
      fields
    } = req.body;
    const fieldNames = Object.keys(fields);

    if (fieldNames.length < 1) {
      throw new Error('No fields provided.');
    }

    const indexPattern = await indexPatternsService.get(id);
    let changeCount = 0;

    for (const fieldName of fieldNames) {
      const field = fields[fieldName];

      if (field.customLabel !== undefined) {
        changeCount++;
        indexPattern.setFieldCustomLabel(fieldName, field.customLabel);
      }

      if (field.count !== undefined) {
        changeCount++;
        indexPattern.setFieldCount(fieldName, field.count);
      }

      if (field.format !== undefined) {
        changeCount++;

        if (field.format) {
          indexPattern.setFieldFormat(fieldName, field.format);
        } else {
          indexPattern.deleteFieldFormat(fieldName);
        }
      }
    }

    if (changeCount < 1) {
      throw new Error('Change set is empty.');
    }

    await indexPatternsService.updateSavedObject(indexPattern);
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

exports.registerUpdateFieldsRoute = registerUpdateFieldsRoute;