"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAnalyticsRoutes = registerAnalyticsRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const querySchema = {
  start: _configSchema.schema.maybe(_configSchema.schema.string()),
  // Date string, expected format 'YYYY-MM-DD'
  end: _configSchema.schema.maybe(_configSchema.schema.string()),
  // Date string, expected format 'YYYY-MM-DD'
  tag: _configSchema.schema.maybe(_configSchema.schema.string())
};
const queriesSchema = { ...querySchema,
  size: _configSchema.schema.maybe(_configSchema.schema.number())
};

function registerAnalyticsRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/app_search/engines/{engineName}/analytics/queries',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object(queriesSchema)
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/analytics/queries'
  }));
  router.get({
    path: '/api/app_search/engines/{engineName}/analytics/queries/{query}',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        query: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object(querySchema)
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/analytics/query/:query'
  }));
}