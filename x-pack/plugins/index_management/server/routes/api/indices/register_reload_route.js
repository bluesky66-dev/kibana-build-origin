"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerReloadRoute = registerReloadRoute;

var _configSchema = require("@kbn/config-schema");

var _fetch_indices = require("../../../lib/fetch_indices");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.maybe(_configSchema.schema.object({
  indexNames: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
}));

function registerReloadRoute({
  router,
  license,
  indexDataEnricher,
  lib
}) {
  router.post({
    path: (0, _index.addBasePath)('/indices/reload'),
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    var _ref;

    const {
      indexNames = []
    } = (_ref = req.body) !== null && _ref !== void 0 ? _ref : {};

    try {
      const indices = await (0, _fetch_indices.fetchIndices)(ctx.core.elasticsearch.legacy.client.callAsCurrentUser, indexDataEnricher, indexNames);
      return res.ok({
        body: indices
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