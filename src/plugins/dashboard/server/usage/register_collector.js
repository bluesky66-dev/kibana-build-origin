"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDashboardUsageCollector = registerDashboardUsageCollector;

var _dashboard_telemetry = require("./dashboard_telemetry");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerDashboardUsageCollector(usageCollection, embeddableService) {
  const dashboardCollector = usageCollection.makeUsageCollector({
    type: 'dashboard',
    isReady: () => true,
    fetch: async ({
      soClient
    }) => {
      return await (0, _dashboard_telemetry.collectDashboardTelemetry)(soClient, embeddableService);
    },
    schema: {
      panels: {
        type: 'long'
      },
      panelsByValue: {
        type: 'long'
      },
      lensByValue: {
        DYNAMIC_KEY: {
          type: 'long'
        }
      },
      visualizationByValue: {
        DYNAMIC_KEY: {
          type: 'long'
        }
      }
    }
  });
  usageCollection.registerCollector(dashboardCollector);
}