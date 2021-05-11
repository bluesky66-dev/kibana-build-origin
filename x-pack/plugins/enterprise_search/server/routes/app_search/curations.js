"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCurationsRoutes = registerCurationsRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerCurationsRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/app_search/engines/{engineName}/curations/find_or_create',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        query: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/curations/find_or_create'
  }));
}