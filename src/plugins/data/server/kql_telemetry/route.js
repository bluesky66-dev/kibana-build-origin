"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerKqlTelemetryRoute = registerKqlTelemetryRoute;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerKqlTelemetryRoute(router, getStartServices, logger) {
  router.post({
    path: '/api/kibana/kql_opt_in_stats',
    validate: {
      body: _configSchema.schema.object({
        opt_in: _configSchema.schema.boolean()
      })
    }
  }, async (context, request, response) => {
    const [{
      savedObjects
    }] = await getStartServices();
    const internalRepository = savedObjects.createScopedRepository(request);
    const {
      body: {
        opt_in: optIn
      }
    } = request;
    const counterName = optIn ? 'optInCount' : 'optOutCount';

    try {
      await internalRepository.incrementCounter('kql-telemetry', 'kql-telemetry', [counterName]);
    } catch (error) {
      logger.warn(`Unable to increment counter: ${error}`);
      return response.customError({
        statusCode: error.status,
        body: {
          message: 'Something went wrong',
          attributes: {
            success: false
          }
        }
      });
    }

    return response.ok({
      body: {
        success: true
      }
    });
  });
}