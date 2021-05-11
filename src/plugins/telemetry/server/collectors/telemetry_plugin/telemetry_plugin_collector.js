"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCollectorFetch = createCollectorFetch;
exports.registerTelemetryPluginUsageCollector = registerTelemetryPluginUsageCollector;

var _operators = require("rxjs/operators");

var _server = require("../../../../../core/server");

var _telemetry_repository = require("../../telemetry_repository");

var _telemetry_config = require("../../../common/telemetry_config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createCollectorFetch({
  currentKibanaVersion,
  config$,
  getSavedObjectsClient
}) {
  return async function fetchUsageStats() {
    const {
      sendUsageFrom,
      allowChangingOptInStatus,
      optIn = null
    } = await config$.pipe((0, _operators.take)(1)).toPromise();
    const configTelemetrySendUsageFrom = sendUsageFrom;
    const configTelemetryOptIn = optIn;
    let telemetrySavedObject = {};

    try {
      const internalRepository = getSavedObjectsClient();
      telemetrySavedObject = await (0, _telemetry_repository.getTelemetrySavedObject)(new _server.SavedObjectsClient(internalRepository));
    } catch (err) {// no-op
    }

    return {
      opt_in_status: (0, _telemetry_config.getTelemetryOptIn)({
        currentKibanaVersion,
        telemetrySavedObject,
        allowChangingOptInStatus,
        configTelemetryOptIn
      }),
      last_reported: telemetrySavedObject ? telemetrySavedObject.lastReported : undefined,
      usage_fetcher: (0, _telemetry_config.getTelemetrySendUsageFrom)({
        telemetrySavedObject,
        configTelemetrySendUsageFrom
      })
    };
  };
}

function registerTelemetryPluginUsageCollector(usageCollection, options) {
  const collector = usageCollection.makeUsageCollector({
    type: 'telemetry',
    isReady: () => typeof options.getSavedObjectsClient() !== 'undefined',
    fetch: createCollectorFetch(options),
    schema: {
      opt_in_status: {
        type: 'boolean'
      },
      usage_fetcher: {
        type: 'keyword'
      },
      last_reported: {
        type: 'long'
      }
    }
  });
  usageCollection.registerCollector(collector);
}