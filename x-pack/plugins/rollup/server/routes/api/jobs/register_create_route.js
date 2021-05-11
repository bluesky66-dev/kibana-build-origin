"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerCreateRoute = ({
  router,
  license,
  lib: {
    isEsError,
    formatEsError
  }
}) => {
  router.put({
    path: (0, _services.addBasePath)('/create'),
    validate: {
      body: _configSchema.schema.object({
        job: _configSchema.schema.object({
          id: _configSchema.schema.string()
        }, {
          unknowns: 'allow'
        })
      })
    }
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const {
        id,
        ...rest
      } = request.body.job; // Create job.

      await context.rollup.client.callAsCurrentUser('rollup.createJob', {
        id,
        body: rest
      }); // Then request the newly created job.

      const results = await context.rollup.client.callAsCurrentUser('rollup.job', {
        id
      });
      return response.ok({
        body: results.jobs[0]
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

exports.registerCreateRoute = registerCreateRoute;