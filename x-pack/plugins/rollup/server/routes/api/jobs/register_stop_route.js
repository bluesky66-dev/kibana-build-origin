"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStopRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerStopRoute = ({
  router,
  license,
  lib: {
    isEsError,
    formatEsError
  }
}) => {
  router.post({
    path: (0, _services.addBasePath)('/stop'),
    validate: {
      body: _configSchema.schema.object({
        jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
      }),
      query: _configSchema.schema.object({
        waitForCompletion: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const {
        jobIds
      } = request.body; // For our API integration tests we need to wait for the jobs to be stopped
      // in order to be able to delete them sequentially.

      const {
        waitForCompletion
      } = request.query;

      const stopRollupJob = id => context.rollup.client.callAsCurrentUser('rollup.stopJob', {
        id,
        waitForCompletion: waitForCompletion === 'true'
      });

      const data = await Promise.all(jobIds.map(stopRollupJob)).then(() => ({
        success: true
      }));
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

exports.registerStopRoute = registerStopRoute;