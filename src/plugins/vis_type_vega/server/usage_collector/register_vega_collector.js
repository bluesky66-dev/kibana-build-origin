"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerVegaUsageCollector = registerVegaUsageCollector;

var _operators = require("rxjs/operators");

var _get_usage_collector = require("./get_usage_collector");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerVegaUsageCollector(collectorSet, config, dependencies) {
  const collector = collectorSet.makeUsageCollector({
    type: 'vis_type_vega',
    isReady: () => true,
    schema: {
      vega_lib_specs_total: {
        type: 'long'
      },
      vega_lite_lib_specs_total: {
        type: 'long'
      },
      vega_use_map_total: {
        type: 'long'
      }
    },
    fetch: async ({
      esClient
    }) => {
      const {
        index
      } = (await config.pipe((0, _operators.first)()).toPromise()).kibana;
      return await (0, _get_usage_collector.getStats)(esClient, index, dependencies);
    }
  });
  collectorSet.registerCollector(collector);
}