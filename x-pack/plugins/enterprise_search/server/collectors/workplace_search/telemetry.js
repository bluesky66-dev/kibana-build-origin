"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTelemetryUsageCollector = exports.WS_TELEMETRY_NAME = void 0;

var _lodash = require("lodash");

var _telemetry = require("../lib/telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const WS_TELEMETRY_NAME = 'workplace_search_telemetry';
/**
 * Register the telemetry collector
 */

exports.WS_TELEMETRY_NAME = WS_TELEMETRY_NAME;

const registerTelemetryUsageCollector = (usageCollection, savedObjects, log) => {
  const telemetryUsageCollector = usageCollection.makeUsageCollector({
    type: 'workplace_search',
    fetch: async () => fetchTelemetryMetrics(savedObjects, log),
    isReady: () => true,
    schema: {
      ui_viewed: {
        setup_guide: {
          type: 'long'
        },
        overview: {
          type: 'long'
        }
      },
      ui_error: {
        cannot_connect: {
          type: 'long'
        },
        not_found: {
          type: 'long'
        }
      },
      ui_clicked: {
        header_launch_button: {
          type: 'long'
        },
        org_name_change_button: {
          type: 'long'
        },
        onboarding_card_button: {
          type: 'long'
        },
        recent_activity_source_details_link: {
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
  const savedObjectAttributes = await (0, _telemetry.getSavedObjectAttributesFromRepo)(WS_TELEMETRY_NAME, savedObjectsRepository, log);
  const defaultTelemetrySavedObject = {
    ui_viewed: {
      setup_guide: 0,
      overview: 0
    },
    ui_error: {
      cannot_connect: 0,
      not_found: 0
    },
    ui_clicked: {
      header_launch_button: 0,
      org_name_change_button: 0,
      onboarding_card_button: 0,
      recent_activity_source_details_link: 0
    }
  }; // If we don't have an existing/saved telemetry object, return the default

  if (!savedObjectAttributes) {
    return defaultTelemetrySavedObject;
  }

  return {
    ui_viewed: {
      setup_guide: (0, _lodash.get)(savedObjectAttributes, 'ui_viewed.setup_guide', 0),
      overview: (0, _lodash.get)(savedObjectAttributes, 'ui_viewed.overview', 0)
    },
    ui_error: {
      cannot_connect: (0, _lodash.get)(savedObjectAttributes, 'ui_error.cannot_connect', 0),
      not_found: (0, _lodash.get)(savedObjectAttributes, 'ui_error.not_found', 0)
    },
    ui_clicked: {
      header_launch_button: (0, _lodash.get)(savedObjectAttributes, 'ui_clicked.header_launch_button', 0),
      org_name_change_button: (0, _lodash.get)(savedObjectAttributes, 'ui_clicked.org_name_change_button', 0),
      onboarding_card_button: (0, _lodash.get)(savedObjectAttributes, 'ui_clicked.onboarding_card_button', 0),
      recent_activity_source_details_link: (0, _lodash.get)(savedObjectAttributes, 'ui_clicked.recent_activity_source_details_link', 0)
    }
  };
};