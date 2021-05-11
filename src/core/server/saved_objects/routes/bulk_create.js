"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBulkCreateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerBulkCreateRoute = (router, {
  coreUsageData
}) => {
  router.post({
    path: '/_bulk_create',
    validate: {
      query: _configSchema.schema.object({
        overwrite: _configSchema.schema.boolean({
          defaultValue: false
        })
      }),
      body: _configSchema.schema.arrayOf(_configSchema.schema.object({
        type: _configSchema.schema.string(),
        id: _configSchema.schema.maybe(_configSchema.schema.string()),
        attributes: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any()),
        version: _configSchema.schema.maybe(_configSchema.schema.string()),
        migrationVersion: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string())),
        coreMigrationVersion: _configSchema.schema.maybe(_configSchema.schema.string()),
        references: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
          name: _configSchema.schema.string(),
          type: _configSchema.schema.string(),
          id: _configSchema.schema.string()
        }))),
        initialNamespaces: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string(), {
          minSize: 1
        }))
      }))
    }
  }, (0, _utils.catchAndReturnBoomErrors)(async (context, req, res) => {
    const {
      overwrite
    } = req.query;
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementSavedObjectsBulkCreate({
      request: req
    }).catch(() => {});
    const result = await context.core.savedObjects.client.bulkCreate(req.body, {
      overwrite
    });
    return res.ok({
      body: result
    });
  }));
};

exports.registerBulkCreateRoute = registerBulkCreateRoute;