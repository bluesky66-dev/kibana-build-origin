"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateScriptedFieldRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _error = require("../../error");

var _handle_errors = require("../util/handle_errors");

var _schemas = require("../util/schemas");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerUpdateScriptedFieldRoute = (router, getStartServices) => {
  router.post({
    path: '/api/index_patterns/index_pattern/{id}/scripted_field/{name}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        }),
        name: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        })
      }, {
        unknowns: 'allow'
      }),
      body: _configSchema.schema.object({
        field: _configSchema.schema.object({ ..._schemas.fieldSpecSchemaFields,
          // We need to overwrite the below fields on top of `fieldSpecSchemaFields`,
          // because `name` field must not appear here and other below fields
          // should be possible to not provide `schema.maybe()` instead of
          // them being required with a default value in `fieldSpecSchemaFields`.
          name: _configSchema.schema.never(),
          type: _configSchema.schema.maybe(_configSchema.schema.string({
            maxLength: 1_000
          })),
          searchable: _configSchema.schema.maybe(_configSchema.schema.boolean()),
          aggregatable: _configSchema.schema.maybe(_configSchema.schema.boolean())
        })
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
    const name = req.params.name;
    const field = { ...req.body.field,
      name
    };
    const indexPattern = await indexPatternsService.get(id);
    let fieldObject = indexPattern.fields.getByName(field.name);

    if (!fieldObject) {
      throw new _error.ErrorIndexPatternFieldNotFound(id, name);
    }

    if (!fieldObject.scripted) {
      throw new Error('Only scripted fields can be updated.');
    }

    const oldSpec = fieldObject.toSpec();
    indexPattern.fields.remove(fieldObject);
    indexPattern.fields.add({ ...oldSpec,
      ...field
    });
    await indexPatternsService.updateSavedObject(indexPattern);
    fieldObject = indexPattern.fields.getByName(field.name);
    if (!fieldObject) throw new Error(`Could not create a field [name = ${field.name}].`);
    return res.ok({
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        field: fieldObject.toSpec(),
        index_pattern: indexPattern.toSpec()
      })
    });
  })));
};

exports.registerUpdateScriptedFieldRoute = registerUpdateScriptedFieldRoute;