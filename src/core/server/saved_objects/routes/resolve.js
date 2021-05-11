"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerResolveRoute = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerResolveRoute = (router, {
  coreUsageData
}) => {
  router.get({
    path: '/resolve/{type}/{id}',
    validate: {
      params: _configSchema.schema.object({
        type: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      })
    }
  }, router.handleLegacyErrors(async (context, req, res) => {
    const {
      type,
      id
    } = req.params;
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementSavedObjectsResolve({
      request: req
    }).catch(() => {});
    const result = await context.core.savedObjects.client.resolve(type, id);
    return res.ok({
      body: result
    });
  }));
};

exports.registerResolveRoute = registerResolveRoute;