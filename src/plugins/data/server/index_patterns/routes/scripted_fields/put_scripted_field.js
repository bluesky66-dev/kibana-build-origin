"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPutScriptedFieldRoute = void 0;

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
const registerPutScriptedFieldRoute = (router, getStartServices) => {
  router.put({
    path: '/api/index_patterns/index_pattern/{id}/scripted_field',
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
        field: _schemas.fieldSpecSchema
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
      field
    } = req.body;

    if (!field.scripted) {
      throw new Error('Only scripted fields can be put.');
    }

    const indexPattern = await indexPatternsService.get(id);
    const oldFieldObject = indexPattern.fields.getByName(field.name);

    if (!!oldFieldObject) {
      indexPattern.fields.remove(oldFieldObject);
    }

    indexPattern.fields.add({ ...field,
      aggregatable: true,
      searchable: true
    });
    await indexPatternsService.updateSavedObject(indexPattern);
    const fieldObject = indexPattern.fields.getByName(field.name);
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

exports.registerPutScriptedFieldRoute = registerPutScriptedFieldRoute;