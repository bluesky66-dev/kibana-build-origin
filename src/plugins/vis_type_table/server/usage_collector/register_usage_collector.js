"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerVisTypeTableUsageCollector = registerVisTypeTableUsageCollector;

var _get_stats = require("./get_stats");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerVisTypeTableUsageCollector(collectorSet) {
  const collector = collectorSet.makeUsageCollector({
    type: 'vis_type_table',
    isReady: () => true,
    schema: {
      total: {
        type: 'long'
      },
      total_split: {
        type: 'long'
      },
      split_columns: {
        total: {
          type: 'long'
        },
        enabled: {
          type: 'long'
        }
      },
      split_rows: {
        total: {
          type: 'long'
        },
        enabled: {
          type: 'long'
        }
      }
    },
    fetch: ({
      soClient
    }) => (0, _get_stats.getStats)(soClient)
  });
  collectorSet.registerCollector(collector);
}