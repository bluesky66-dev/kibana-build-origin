"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateRoute = registerUpdateRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.any();

const paramsSchema = _configSchema.schema.object({
  indexName: _configSchema.schema.string()
});

function registerUpdateRoute({
  router,
  license,
  lib
}) {
  router.put({
    path: (0, _index.addBasePath)('/settings/{indexName}'),
    validate: {
      body: bodySchema,
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      indexName
    } = req.params;
    const params = {
      ignoreUnavailable: true,
      allowNoIndices: false,
      expandWildcards: 'none',
      index: indexName,
      body: req.body
    };

    try {
      const response = await ctx.core.elasticsearch.legacy.client.callAsCurrentUser('indices.putSettings', params);
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