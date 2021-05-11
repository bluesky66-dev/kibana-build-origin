"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeprecationLoggingRoutes = registerDeprecationLoggingRoutes;

var _configSchema = require("@kbn/config-schema");

var _es_deprecation_logging_apis = require("../lib/es_deprecation_logging_apis");

var _es_version_precheck = require("../lib/es_version_precheck");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerDeprecationLoggingRoutes({
  router
}) {
  router.get({
    path: '/api/upgrade_assistant/deprecation_logging',
    validate: false
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core: {
      elasticsearch: {
        client
      }
    }
  }, request, response) => {
    try {
      const result = await (0, _es_deprecation_logging_apis.getDeprecationLoggingStatus)(client);
      return response.ok({
        body: result
      });
    } catch (e) {
      return response.internalError({
        body: e
      });
    }
  }));
  router.put({
    path: '/api/upgrade_assistant/deprecation_logging',
    validate: {
      body: _configSchema.schema.object({
        isEnabled: _configSchema.schema.boolean()
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core: {
      elasticsearch: {
        client
      }
    }
  }, request, response) => {
    try {
      const {
        isEnabled
      } = request.body;
      return response.ok({
        body: await (0, _es_deprecation_logging_apis.setDeprecationLogging)(client, isEnabled)
      });
    } catch (e) {
      return response.internalError({
        body: e
      });
    }
  }));
}