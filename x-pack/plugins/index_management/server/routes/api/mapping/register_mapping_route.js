"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMappingRoute = registerMappingRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  indexName: _configSchema.schema.string()
});

function formatHit(hit, indexName) {
  const mappings = hit[indexName].mappings;
  return {
    mappings
  };
}

function registerMappingRoute({
  router,
  license,
  lib
}) {
  router.get({
    path: (0, _index.addBasePath)('/mapping/{indexName}'),
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      indexName
    } = req.params;
    const params = {
      expand_wildcards: 'none',
      index: indexName,
      include_type_name: true
    };

    try {
      const hit = await ctx.core.elasticsearch.legacy.client.callAsCurrentUser('indices.getMapping', params);
      const response = formatHit(hit, indexName);
      return res.ok({
        body: response
      });
    } catch (e) {
      if (lib.isEsError(e)) {
        return res.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  }));
}