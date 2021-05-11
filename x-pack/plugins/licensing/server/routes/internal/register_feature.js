"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRegisterFeatureRoute = registerRegisterFeatureRoute;

var _configSchema = require("@kbn/config-schema");

var _types = require("../../../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerRegisterFeatureRoute(router, featureUsageSetup) {
  router.post({
    path: '/internal/licensing/feature_usage/register',
    validate: {
      body: _configSchema.schema.arrayOf(_configSchema.schema.object({
        featureName: _configSchema.schema.string(),
        licenseType: _configSchema.schema.string({
          validate: value => {
            if (!(value in _types.LICENSE_TYPE)) {
              return `Invalid license type: ${value}`;
            }
          }
        })
      }))
    }
  }, async (context, request, response) => {
    const registrations = request.body;
    registrations.forEach(({
      featureName,
      licenseType
    }) => {
      featureUsageSetup.register(featureName, licenseType);
    });
    return response.ok({
      body: {
        success: true
      }
    });
  });
}