"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSearchRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerSearchRoute = ({
  router,
  license,
  lib: {
    isEsError,
    formatEsError
  }
}) => {
  router.post({
    path: (0, _services.addBasePath)('/search'),
    validate: {
      body: _configSchema.schema.arrayOf(_configSchema.schema.object({
        index: _configSchema.schema.string(),
        query: _configSchema.schema.any()
      }))
    }
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const requests = request.body.map(({
        index,
        query
      }) => context.rollup.client.callAsCurrentUser('rollup.search', {
        index,
        rest_total_hits_as_int: true,
        body: query
      }));
      const data = await Promise.all(requests);
      return response.ok({
        body: data
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

exports.registerSearchRoute = registerSearchRoute;