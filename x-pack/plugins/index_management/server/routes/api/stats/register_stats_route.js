"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStatsRoute = registerStatsRoute;

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
  const {
    _shards,
    indices
  } = hit;
  const stats = indices[indexName];
  return {
    _shards,
    stats
  };
}

function registerStatsRoute({
  router,
  license,
  lib
}) {
  router.get({
    path: (0, _index.addBasePath)('/stats/{indexName}'),
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      indexName
    } = req.params;
    const params = {
      expand_wildcards: 'none',
      index: indexName
    };

    try {
      const hit = await ctx.core.elasticsearch.legacy.client.callAsCurrentUser('indices.stats', params);
      return res.ok({
        body: formatHit(hit, indexName)
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