"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSecurityRoute = registerSecurityRoute;
exports.registerSecuritySourceRestrictionsRoute = registerSecuritySourceRestrictionsRoute;
exports.registerSecurityRoutes = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerSecurityRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/workplace_search/org/security',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/security'
  }));
}

function registerSecuritySourceRestrictionsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/workplace_search/org/security/source_restrictions',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/security/source_restrictions'
  }));
  router.patch({
    path: '/api/workplace_search/org/security/source_restrictions',
    validate: {
      body: _configSchema.schema.object({
        isEnabled: _configSchema.schema.boolean(),
        remote: _configSchema.schema.object({
          isEnabled: _configSchema.schema.boolean(),
          contentSources: _configSchema.schema.arrayOf(_configSchema.schema.object({
            isEnabled: _configSchema.schema.boolean(),
            id: _configSchema.schema.string(),
            name: _configSchema.schema.string()
          }))
        }),
        standard: _configSchema.schema.object({
          isEnabled: _configSchema.schema.boolean(),
          contentSources: _configSchema.schema.arrayOf(_configSchema.schema.object({
            isEnabled: _configSchema.schema.boolean(),
            id: _configSchema.schema.string(),
            name: _configSchema.schema.string()
          }))
        })
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/security/source_restrictions'
  }));
}

const registerSecurityRoutes = dependencies => {
  registerSecurityRoute(dependencies);
  registerSecuritySourceRestrictionsRoute(dependencies);
};

exports.registerSecurityRoutes = registerSecurityRoutes;