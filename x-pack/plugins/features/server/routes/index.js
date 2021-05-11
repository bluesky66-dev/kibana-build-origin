"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineRoutes({
  router,
  featureRegistry
}) {
  router.get({
    path: '/api/features',
    options: {
      tags: ['access:features']
    },
    validate: {
      query: _configSchema.schema.object({
        ignoreValidLicenses: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    }
  }, (context, request, response) => {
    const currentLicense = context.licensing.license;
    const allFeatures = featureRegistry.getAllKibanaFeatures(currentLicense, request.query.ignoreValidLicenses);
    return response.ok({
      body: allFeatures.sort((f1, f2) => {
        var _f1$order, _f2$order;

        return ((_f1$order = f1.order) !== null && _f1$order !== void 0 ? _f1$order : Number.MAX_SAFE_INTEGER) - ((_f2$order = f2.order) !== null && _f2$order !== void 0 ? _f2$order : Number.MAX_SAFE_INTEGER);
      }).map(feature => feature.toRaw())
    });
  });
}