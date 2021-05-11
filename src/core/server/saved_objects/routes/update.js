"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerUpdateRoute = (router, {
  coreUsageData
}) => {
  router.put({
    path: '/{type}/{id}',
    validate: {
      params: _configSchema.schema.object({
        type: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        attributes: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any()),
        version: _configSchema.schema.maybe(_configSchema.schema.string()),
        references: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
          name: _configSchema.schema.string(),
          type: _configSchema.schema.string(),
          id: _configSchema.schema.string()
        })))
      })
    }
  }, (0, _utils.catchAndReturnBoomErrors)(async (context, req, res) => {
    const {
      type,
      id
    } = req.params;
    const {
      attributes,
      version,
      references
    } = req.body;
    const options = {
      version,
      references
    };
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementSavedObjectsUpdate({
      request: req
    }).catch(() => {});
    const result = await context.core.savedObjects.client.update(type, id, attributes, options);
    return res.ok({
      body: result
    });
  }));
};

exports.registerUpdateRoute = registerUpdateRoute;