"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRoute = void 0;

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns a list of all rollup index names
 */


const registerGetRoute = ({
  router,
  license,
  lib: {
    isEsError,
    formatEsError,
    getCapabilitiesForRollupIndices
  }
}) => {
  router.get({
    path: (0, _services.addBasePath)('/indices'),
    validate: false
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const data = await context.rollup.client.callAsCurrentUser('rollup.rollupIndexCapabilities', {
        indexPattern: '_all'
      });
      return response.ok({
        body: getCapabilitiesForRollupIndices(data)
      });
    } catch (err) {
      if (isEsError(err)) {
        return response.customError({
          statusCode: err.statusCode,
          body: err
        });
      }

      return response.internalError({
        body: err
      });
    }
  }));
};

exports.registerGetRoute = registerGetRoute;