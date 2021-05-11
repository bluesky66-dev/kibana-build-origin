"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerListRoute = registerListRoute;

var _fetch_indices = require("../../../lib/fetch_indices");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerListRoute({
  router,
  license,
  indexDataEnricher,
  lib
}) {
  router.get({
    path: (0, _index.addBasePath)('/indices'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const indices = await (0, _fetch_indices.fetchIndices)(ctx.core.elasticsearch.legacy.client.callAsCurrentUser, indexDataEnricher);
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