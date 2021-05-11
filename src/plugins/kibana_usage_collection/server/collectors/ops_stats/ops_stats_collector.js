"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOpsStatsCollector = getOpsStatsCollector;
exports.registerOpsStatsCollector = registerOpsStatsCollector;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../../common/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Initialize a collector for Kibana Ops Stats
 */
function getOpsStatsCollector(usageCollection, metrics$) {
  let lastMetrics = null;
  metrics$.subscribe(_metrics => {
    const metrics = (0, _lodash.cloneDeep)(_metrics); // Ensure we only include the same data that Metricbeat collection would get
    // @ts-expect-error

    delete metrics.process.pid;
    const responseTimes = {
      average: metrics.response_times.avg_in_millis,
      max: metrics.response_times.max_in_millis
    }; // @ts-expect-error

    delete metrics.requests.statusCodes;
    lastMetrics = { ...(0, _lodash.omit)(metrics, ['collected_at']),
      response_times: responseTimes,
      timestamp: _moment.default.utc(metrics.collected_at).toISOString()
    };
  });
  return usageCollection.makeStatsCollector({
    type: _constants.KIBANA_STATS_TYPE,
    isReady: () => !!lastMetrics,
    fetch: () => lastMetrics
  });
}

function registerOpsStatsCollector(usageCollection, metrics$) {
  usageCollection.registerCollector(getOpsStatsCollector(usageCollection, metrics$));
}