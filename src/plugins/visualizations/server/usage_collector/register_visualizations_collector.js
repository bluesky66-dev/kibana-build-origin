"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerVisualizationsCollector = registerVisualizationsCollector;

var _operators = require("rxjs/operators");

var _get_usage_collector = require("./get_usage_collector");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerVisualizationsCollector(collectorSet, config) {
  const collector = collectorSet.makeUsageCollector({
    type: 'visualization_types',
    isReady: () => true,
    schema: {
      DYNAMIC_KEY: {
        total: {
          type: 'long'
        },
        spaces_min: {
          type: 'long'
        },
        spaces_max: {
          type: 'long'
        },
        spaces_avg: {
          type: 'long'
        },
        saved_7_days_total: {
          type: 'long'
        },
        saved_30_days_total: {
          type: 'long'
        },
        saved_90_days_total: {
          type: 'long'
        }
      }
    },
    fetch: async ({
      esClient
    }) => {
      const index = (await config.pipe((0, _operators.first)()).toPromise()).kibana.index;
      return await (0, _get_usage_collector.getStats)(esClient, index);
    }
  });
  collectorSet.registerCollector(collector);
}