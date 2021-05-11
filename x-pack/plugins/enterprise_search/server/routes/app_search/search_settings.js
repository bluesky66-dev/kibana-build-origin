"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSearchSettingsRoutes = registerSearchSettingsRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// We only do a very light type check here, and allow unknowns, because the request is validated
// on the ent-search server, so it would be redundant to check it here as well.


const boosts = _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.object({}, {
  unknowns: 'allow'
})));

const resultFields = _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({}, {
  unknowns: 'allow'
}));

const searchFields = _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({}, {
  unknowns: 'allow'
}));

const searchSettingsSchema = _configSchema.schema.object({
  boosts,
  result_fields: resultFields,
  search_fields: searchFields
});

function registerSearchSettingsRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/app_search/engines/{engineName}/search_settings/details',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/search_settings/details'
  }));
  router.post({
    path: '/api/app_search/engines/{engineName}/search_settings/reset',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/search_settings/reset'
  }));
  router.put({
    path: '/api/app_search/engines/{engineName}/search_settings',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      }),
      body: searchSettingsSchema
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/search_settings'
  }));
  router.post({
    path: '/api/app_search/engines/{engineName}/search_settings_search',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        boosts,
        search_fields: searchFields
      }),
      query: _configSchema.schema.object({
        query: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/search_settings_search'
  }));
}