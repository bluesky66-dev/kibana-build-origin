"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCapabilitiesRoutes = registerCapabilitiesRoutes;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerCapabilitiesRoutes(router, resolver) {
  router.post({
    path: '/api/core/capabilities',
    options: {
      authRequired: 'optional'
    },
    validate: {
      query: _configSchema.schema.object({
        useDefaultCapabilities: _configSchema.schema.boolean({
          defaultValue: false
        })
      }),
      body: _configSchema.schema.object({
        applications: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, async (ctx, req, res) => {
    const {
      useDefaultCapabilities
    } = req.query;
    const {
      applications
    } = req.body;
    const capabilities = await resolver(req, applications, useDefaultCapabilities);
    return res.ok({
      body: capabilities
    });
  });
}