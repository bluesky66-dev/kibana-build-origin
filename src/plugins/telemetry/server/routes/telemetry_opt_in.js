"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTelemetryOptInRoutes = registerTelemetryOptInRoutes;

var _operators = require("rxjs/operators");

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../core/server");

var _telemetry_config = require("../../common/telemetry_config");

var _telemetry_opt_in_stats = require("./telemetry_opt_in_stats");

var _telemetry_repository = require("../telemetry_repository");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerTelemetryOptInRoutes({
  config$,
  logger,
  router,
  currentKibanaVersion,
  telemetryCollectionManager
}) {
  router.post({
    path: '/api/telemetry/v2/optIn',
    validate: {
      body: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean()
      })
    }
  }, async (context, req, res) => {
    const newOptInStatus = req.body.enabled;
    const attributes = {
      enabled: newOptInStatus,
      lastVersionChecked: currentKibanaVersion
    };
    const config = await config$.pipe((0, _operators.take)(1)).toPromise();
    const telemetrySavedObject = await (0, _telemetry_repository.getTelemetrySavedObject)(context.core.savedObjects.client);

    if (telemetrySavedObject === false) {
      // If we get false, we couldn't get the saved object due to lack of permissions
      // so we can assume the user won't be able to update it either
      return res.forbidden();
    }

    const configTelemetryAllowChangingOptInStatus = config.allowChangingOptInStatus;
    const allowChangingOptInStatus = (0, _telemetry_config.getTelemetryAllowChangingOptInStatus)({
      telemetrySavedObject,
      configTelemetryAllowChangingOptInStatus
    });

    if (!allowChangingOptInStatus) {
      return res.badRequest({
        body: JSON.stringify({
          error: 'Not allowed to change Opt-in Status.'
        })
      });
    }

    const statsGetterConfig = {
      unencrypted: false
    };
    const optInStatus = await telemetryCollectionManager.getOptInStats(newOptInStatus, statsGetterConfig);

    if (config.sendUsageFrom === 'server') {
      const optInStatusUrl = config.optInStatusUrl;
      (0, _telemetry_opt_in_stats.sendTelemetryOptInStatus)(telemetryCollectionManager, {
        optInStatusUrl,
        newOptInStatus,
        currentKibanaVersion
      }, statsGetterConfig).catch(err => {
        // The server is likely behind a firewall and can't reach the remote service
        logger.warn(`Failed to notify "${optInStatusUrl}" from the server about the opt-in selection. Possibly blocked by a firewall? - Error: ${err.message}`);
      });
    }

    try {
      await (0, _telemetry_repository.updateTelemetrySavedObject)(context.core.savedObjects.client, attributes);
    } catch (e) {
      if (_server.SavedObjectsErrorHelpers.isForbiddenError(e)) {
        return res.forbidden();
      }
    }

    return res.ok({
      body: optInStatus
    });
  });
}