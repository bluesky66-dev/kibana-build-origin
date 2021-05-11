"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerForcemergeRoute = registerForcemergeRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  indices: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  maxNumSegments: _configSchema.schema.maybe(_configSchema.schema.number())
});

function registerForcemergeRoute({
  router,
  license,
  lib
}) {
  router.post({
    path: (0, _index.addBasePath)('/indices/forcemerge'),
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      maxNumSegments,
      indices = []
    } = req.body;
    const params = {
      expandWildcards: 'none',
      index: indices
    };

    if (maxNumSegments) {
      params.max_num_segments = maxNumSegments;
    }

    try {
      await ctx.core.elasticsearch.legacy.client.callAsCurrentUser('indices.forcemerge', params);
      return res.ok();
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