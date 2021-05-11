"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerNotifyFeatureUsageRoute = registerNotifyFeatureUsageRoute;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerNotifyFeatureUsageRoute(router) {
  router.post({
    path: '/internal/licensing/feature_usage/notify',
    validate: {
      body: _configSchema.schema.object({
        featureName: _configSchema.schema.string(),
        lastUsed: _configSchema.schema.number()
      })
    }
  }, async (context, request, response) => {
    const {
      featureName,
      lastUsed
    } = request.body;
    context.licensing.featureUsage.notifyUsage(featureName, lastUsed);
    return response.ok({
      body: {
        success: true
      }
    });
  });
}