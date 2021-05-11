"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTelemetryUsageCollector = exports.ES_TELEMETRY_NAME = void 0;

var _lodash = require("lodash");

var _telemetry = require("../lib/telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ES_TELEMETRY_NAME = 'enterprise_search_telemetry';
/**
 * Register the telemetry collector
 */

exports.ES_TELEMETRY_NAME = ES_TELEMETRY_NAME;

const registerTelemetryUsageCollector = (usageCollection, savedObjects, log) => {
  const telemetryUsageCollector = usageCollection.makeUsageCollector({
    type: 'enterprise_search',
    fetch: async () => fetchTelemetryMetrics(savedObjects, log),
    isReady: () => true,
    schema: {
      ui_viewed: {
        overview: {
          type: 'long'
        },
        setup_guide: {
          type: 'long'
        }
      },
      ui_error: {
        cannot_connect: {
          type: 'long'
        }
      },
      ui_clicked: {
        app_search: {
          type: 'long'
        },
        workplace_search: {
          type: 'long'
        }
      }
    }
  });
  usageCollection.registerCollector(telemetryUsageCollector);
};
/**
 * Fetch the aggregated telemetry metrics from our saved objects
 */


exports.registerTelemetryUsageCollector = registerTelemetryUsageCollector;

const fetchTelemetryMetrics = async (savedObjects, log) => {
  const savedObjectsRepository = savedObjects.createInternalRepository();
  const savedObjectAttributes = await (0, _telemetry.getSavedObjectAttributesFromRepo)(ES_TELEMETRY_NAME, savedObjectsRepository, log);
  const defaultTelemetrySavedObject = {
    ui_viewed: {
      overview: 0,
      setup_guide: 0
    },
    ui_error: {
      cannot_connect: 0
    },
    ui_clicked: {
      app_search: 0,
      workplace_search: 0
    }
  }; // If we don't have an existing/saved telemetry object, return the default

  if (!savedObjectAttributes) {
    return defaultTelemetrySavedObject;
  }

  return {
    ui_viewed: {
      overview: (0, _lodash.get)(savedObjectAttributes, 'ui_viewed.overview', 0),
      setup_guide: (0, _lodash.get)(savedObjectAttributes, 'ui_viewed.setup_guide', 0)
    },
    ui_error: {
      cannot_connect: (0, _lodash.get)(savedObjectAttributes, 'ui_error.cannot_connect', 0)
    },
    ui_clicked: {
      app_search: (0, _lodash.get)(savedObjectAttributes, 'ui_clicked.app_search', 0),
      workplace_search: (0, _lodash.get)(savedObjectAttributes, 'ui_clicked.workplace_search', 0)
    }
  };
};