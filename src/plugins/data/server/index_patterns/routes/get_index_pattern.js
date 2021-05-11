"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetIndexPatternRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _handle_errors = require("./util/handle_errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerGetIndexPatternRoute = (router, getStartServices) => {
  router.get({
    path: '/api/index_patterns/index_pattern/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        })
      }, {
        unknowns: 'allow'
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

exports.registerGetIndexPatternRoute = registerGetIndexPatternRoute;