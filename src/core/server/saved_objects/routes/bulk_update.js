"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBulkUpdateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerBulkUpdateRoute = (router, {
  coreUsageData
}) => {
  router.put({
    path: '/_bulk_update',
    validate: {
      body: _configSchema.schema.arrayOf(_configSchema.schema.object({
        type: _configSchema.schema.string(),
        id: _configSchema.schema.string(),
        attributes: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any()),
        version: _configSchema.schema.maybe(_configSchema.schema.string()),
        references: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
          name: _configSchema.schema.string(),
          type: _configSchema.schema.string(),
          id: _configSchema.schema.string()
        }))),
        namespace: _configSchema.schema.maybe(_configSchema.schema.string({
          minLength: 1
        }))
      }))
    }
  }, (0, _utils.catchAndReturnBoomErrors)(async (context, req, res) => {
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementSavedObjectsBulkUpdate({
      request: req
    }).catch(() => {});
    const savedObject = await context.core.savedObjects.client.bulkUpdate(req.body);
    return res.ok({
      body: savedObject
    });
  }));
};

exports.registerBulkUpdateRoute = registerBulkUpdateRoute;