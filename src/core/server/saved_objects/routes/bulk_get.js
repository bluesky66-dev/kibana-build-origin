"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBulkGetRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerBulkGetRoute = (router, {
  coreUsageData
}) => {
  router.post({
    path: '/_bulk_get',
    validate: {
      body: _configSchema.schema.arrayOf(_configSchema.schema.object({
        type: _configSchema.schema.string(),
        id: _configSchema.schema.string(),
        fields: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
      }))
    }
  }, (0, _utils.catchAndReturnBoomErrors)(async (context, req, res) => {
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementSavedObjectsBulkGet({
      request: req
    }).catch(() => {});
    const result = await context.core.savedObjects.client.bulkGet(req.body);
    return res.ok({
      body: result
    });
  }));
};

exports.registerBulkGetRoute = registerBulkGetRoute;