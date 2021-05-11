"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerGetRoute = (router, {
  coreUsageData
}) => {
  router.get({
    path: '/{type}/{id}',
    validate: {
      params: _configSchema.schema.object({
        type: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      })
    }
  }, (0, _utils.catchAndReturnBoomErrors)(async (context, req, res) => {
    const {
      type,
      id
    } = req.params;
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementSavedObjectsGet({
      request: req
    }).catch(() => {});
    const savedObject = await context.core.savedObjects.client.get(type, id);
    return res.ok({
      body: savedObject
    });
  }));
};

exports.registerGetRoute = registerGetRoute;