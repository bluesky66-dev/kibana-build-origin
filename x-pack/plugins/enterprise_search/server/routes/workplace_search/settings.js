"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerOrgSettingsRoute = registerOrgSettingsRoute;
exports.registerOrgSettingsCustomizeRoute = registerOrgSettingsCustomizeRoute;
exports.registerOrgSettingsOauthApplicationRoute = registerOrgSettingsOauthApplicationRoute;
exports.registerSettingsRoutes = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerOrgSettingsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/workplace_search/org/settings',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings'
  }));
}

function registerOrgSettingsCustomizeRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.put({
    path: '/api/workplace_search/org/settings/customize',
    validate: {
      body: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/customize'
  }));
}

function registerOrgSettingsOauthApplicationRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.put({
    path: '/api/workplace_search/org/settings/oauth_application',
    validate: {
      body: _configSchema.schema.object({
        oauth_application: _configSchema.schema.object({
          name: _configSchema.schema.string(),
          confidential: _configSchema.schema.boolean(),
          redirect_uri: _configSchema.schema.string()
        })
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/oauth_application'
  }));
}

const registerSettingsRoutes = dependencies => {
  registerOrgSettingsRoute(dependencies);
  registerOrgSettingsCustomizeRoute(dependencies);
  registerOrgSettingsOauthApplicationRoute(dependencies);
};

exports.registerSettingsRoutes = registerSettingsRoutes;