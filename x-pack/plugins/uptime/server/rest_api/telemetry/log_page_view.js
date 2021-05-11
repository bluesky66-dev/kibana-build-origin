"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLogPageViewRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _telemetry = require("../../lib/adapters/telemetry");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createLogPageViewRoute = () => ({
  method: 'POST',
  path: _constants.API_URLS.LOG_PAGE_VIEW,
  validate: {
    body: _configSchema.schema.object({
      page: _configSchema.schema.string(),
      dateStart: _configSchema.schema.string(),
      dateEnd: _configSchema.schema.string(),
      autoRefreshEnabled: _configSchema.schema.boolean(),
      autorefreshInterval: _configSchema.schema.number(),
      refreshTelemetryHistory: _configSchema.schema.maybe(_configSchema.schema.boolean()),
      _debug: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  handler: async ({
    savedObjectsClient,
    uptimeEsClient,
    request
  }) => {
    const pageView = request.body;

    if (pageView.refreshTelemetryHistory) {
      _telemetry.KibanaTelemetryAdapter.clearLocalTelemetry();
    }

    await _telemetry.KibanaTelemetryAdapter.countNoOfUniqueMonitorAndLocations(uptimeEsClient, savedObjectsClient);
    return _telemetry.KibanaTelemetryAdapter.countPageView(pageView);
  }
});

exports.createLogPageViewRoute = createLogPageViewRoute;