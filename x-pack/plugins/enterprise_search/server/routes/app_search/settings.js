"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSettingsRoutes = registerSettingsRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerSettingsRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/app_search/log_settings',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/log_settings'
  }));
  router.put({
    path: '/api/app_search/log_settings',
    validate: {
      body: _configSchema.schema.object({
        api: _configSchema.schema.maybe(_configSchema.schema.object({
          enabled: _configSchema.schema.boolean()
        })),
        analytics: _configSchema.schema.maybe(_configSchema.schema.object({
          enabled: _configSchema.schema.boolean()
        }))
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/log_settings'
  }));
}