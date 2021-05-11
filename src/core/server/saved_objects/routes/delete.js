"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerDeleteRoute = (router, {
  coreUsageData
}) => {
  router.delete({
    path: '/{type}/{id}',
    validate: {
      params: _configSchema.schema.object({
        type: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        force: _configSchema.schema.maybe(_configSchema.schema.boolean())
      })
    }
  }, (0, _utils.catchAndReturnBoomErrors)(async (context, req, res) => {
    const {
      type,
      id
    } = req.params;
    const {
      force
    } = req.query;
    const {
      getClient
    } = context.core.savedObjects;
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementSavedObjectsDelete({
      request: req
    }).catch(() => {});
    const client = getClient();
    const result = await client.delete(type, id, {
      force
    });
    return res.ok({
      body: result
    });
  }));
};

exports.registerDeleteRoute = registerDeleteRoute;