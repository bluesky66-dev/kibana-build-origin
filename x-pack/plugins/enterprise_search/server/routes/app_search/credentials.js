"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCredentialsRoutes = registerCredentialsRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const tokenSchema = _configSchema.schema.oneOf([_configSchema.schema.object({
  name: _configSchema.schema.string(),
  type: _configSchema.schema.literal('admin')
}), _configSchema.schema.object({
  name: _configSchema.schema.string(),
  type: _configSchema.schema.literal('private'),
  read: _configSchema.schema.boolean(),
  write: _configSchema.schema.boolean(),
  access_all_engines: _configSchema.schema.boolean(),
  engines: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
}), _configSchema.schema.object({
  name: _configSchema.schema.string(),
  type: _configSchema.schema.literal('search'),
  access_all_engines: _configSchema.schema.boolean(),
  engines: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
})]);

function registerCredentialsRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  // Credentials API
  router.get({
    path: '/api/app_search/credentials',
    validate: {
      query: _configSchema.schema.object({
        'page[current]': _configSchema.schema.number()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/credentials/collection'
  }));
  router.post({
    path: '/api/app_search/credentials',
    validate: {
      body: tokenSchema
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/credentials/collection'
  })); // TODO: It would be great to remove this someday

  router.get({
    path: '/api/app_search/credentials/details',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/credentials/details'
  })); // Single credential API

  router.put({
    path: '/api/app_search/credentials/{name}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      }),
      body: tokenSchema
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/credentials/:name'
  }));
  router.delete({
    path: '/api/app_search/credentials/{name}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/credentials/:name'
  }));
}