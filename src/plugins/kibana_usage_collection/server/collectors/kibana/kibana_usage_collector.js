"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaUsageCollector = getKibanaUsageCollector;
exports.registerKibanaUsageCollector = registerKibanaUsageCollector;

var _operators = require("rxjs/operators");

var _get_saved_object_counts = require("./get_saved_object_counts");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getKibanaUsageCollector(usageCollection, legacyConfig$) {
  return usageCollection.makeUsageCollector({
    type: 'kibana',
    isReady: () => true,
    schema: {
      index: {
        type: 'keyword'
      },
      dashboard: {
        total: {
          type: 'long'
        }
      },
      visualization: {
        total: {
          type: 'long'
        }
      },
      search: {
        total: {
          type: 'long'
        }
      },
      index_pattern: {
        total: {
          type: 'long'
        }
      },
      graph_workspace: {
        total: {
          type: 'long'
        }
      },
      timelion_sheet: {
        total: {
          type: 'long'
        }
      }
    },

    async fetch({
      esClient
    }) {
      const {
        kibana: {
          index
        }
      } = await legacyConfig$.pipe((0, _operators.take)(1)).toPromise();
      return {
        index,
        ...(await (0, _get_saved_object_counts.getSavedObjectsCounts)(esClient, index))
      };
    }

  });
}

function registerKibanaUsageCollector(usageCollection, legacyConfig$) {
  usageCollection.registerCollector(getKibanaUsageCollector(usageCollection, legacyConfig$));
}