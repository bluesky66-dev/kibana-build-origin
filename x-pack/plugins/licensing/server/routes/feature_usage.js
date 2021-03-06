"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFeatureUsageRoute = registerFeatureUsageRoute;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerFeatureUsageRoute(router, getStartServices) {
  router.get({
    path: '/api/licensing/feature_usage',
    validate: false
  }, async (context, request, response) => {
    const [,, {
      featureUsage
    }] = await getStartServices();
    return response.ok({
      body: {
        features: featureUsage.getLastUsages().map(usage => ({
          name: usage.name,
          last_used: usage.lastUsed,
          license_level: usage.licenseType
        }))
      }
    });
  });
}