"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTelemetryRoute = registerTelemetryRoute;

var _configSchema = require("@kbn/config-schema");

var _telemetry = require("../../collectors/app_search/telemetry");

var _telemetry2 = require("../../collectors/enterprise_search/telemetry");

var _telemetry3 = require("../../collectors/lib/telemetry");

var _telemetry4 = require("../../collectors/workplace_search/telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const productToTelemetryMap = {
  enterprise_search: _telemetry2.ES_TELEMETRY_NAME,
  app_search: _telemetry.AS_TELEMETRY_NAME,
  workplace_search: _telemetry4.WS_TELEMETRY_NAME
};

function registerTelemetryRoute({
  router,
  getSavedObjectsService,
  log
}) {
  router.put({
    path: '/api/enterprise_search/stats',
    validate: {
      body: _configSchema.schema.object({
        product: _configSchema.schema.oneOf([_configSchema.schema.literal('app_search'), _configSchema.schema.literal('workplace_search'), _configSchema.schema.literal('enterprise_search')]),
        action: _configSchema.schema.oneOf([_configSchema.schema.literal('viewed'), _configSchema.schema.literal('clicked'), _configSchema.schema.literal('error')]),
        metric: _configSchema.schema.string()
      })
    }
  }, async (ctx, request, response) => {
    const {
      product,
      action,
      metric
    } = request.body;

    try {
      if (!getSavedObjectsService) throw new Error('Could not find Saved Objects service');
      return response.ok({
        body: await (0, _telemetry3.incrementUICounter)({
          id: productToTelemetryMap[product],
          savedObjects: getSavedObjectsService(),
          uiAction: `ui_${action}`,
          metric
        })
      });
    } catch (e) {
      log.error(`Enterprise Search UI telemetry error: ${e instanceof Error ? e.stack : e.toString()}`);
      return response.internalError({
        body: 'Enterprise Search UI telemetry failed'
      });
    }
  });
}