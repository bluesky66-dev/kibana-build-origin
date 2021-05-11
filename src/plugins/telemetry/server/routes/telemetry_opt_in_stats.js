"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendTelemetryOptInStatus = sendTelemetryOptInStatus;
exports.registerTelemetryOptInStatsRoutes = registerTelemetryOptInStatsRoutes;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _configSchema = require("@kbn/config-schema");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function sendTelemetryOptInStatus(telemetryCollectionManager, config, statsGetterConfig) {
  const {
    optInStatusUrl,
    newOptInStatus,
    currentKibanaVersion
  } = config;
  const optInStatus = await telemetryCollectionManager.getOptInStats(newOptInStatus, statsGetterConfig);
  await (0, _nodeFetch.default)(optInStatusUrl, {
    method: 'post',
    body: JSON.stringify(optInStatus),
    headers: {
      'X-Elastic-Stack-Version': currentKibanaVersion
    }
  });
}

function registerTelemetryOptInStatsRoutes(router, telemetryCollectionManager) {
  router.post({
    path: '/api/telemetry/v2/clusters/_opt_in_stats',
    validate: {
      body: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean(),
        unencrypted: _configSchema.schema.boolean({
          defaultValue: true
        })
      })
    }
  }, async (context, req, res) => {
    try {
      const newOptInStatus = req.body.enabled;
      const unencrypted = req.body.unencrypted;
      const statsGetterConfig = {
        unencrypted,
        request: req
      };
      const optInStatus = await telemetryCollectionManager.getOptInStats(newOptInStatus, statsGetterConfig);
      return res.ok({
        body: optInStatus
      });
    } catch (err) {
      return res.ok({
        body: []
      });
    }
  });
}