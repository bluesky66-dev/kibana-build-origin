"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitoringStats = createMonitoringStats;
Object.defineProperty(exports, "MonitoringStats", {
  enumerable: true,
  get: function () {
    return _monitoring_stats_stream.MonitoringStats;
  }
});
Object.defineProperty(exports, "HealthStatus", {
  enumerable: true,
  get: function () {
    return _monitoring_stats_stream.HealthStatus;
  }
});
Object.defineProperty(exports, "RawMonitoringStats", {
  enumerable: true,
  get: function () {
    return _monitoring_stats_stream.RawMonitoringStats;
  }
});
Object.defineProperty(exports, "summarizeMonitoringStats", {
  enumerable: true,
  get: function () {
    return _monitoring_stats_stream.summarizeMonitoringStats;
  }
});
Object.defineProperty(exports, "createAggregators", {
  enumerable: true,
  get: function () {
    return _monitoring_stats_stream.createAggregators;
  }
});
Object.defineProperty(exports, "createMonitoringStatsStream", {
  enumerable: true,
  get: function () {
    return _monitoring_stats_stream.createMonitoringStatsStream;
  }
});

var _monitoring_stats_stream = require("./monitoring_stats_stream");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createMonitoringStats(taskPollingLifecycle, taskStore, elasticsearchAndSOAvailability$, config, managedConfig, logger) {
  return (0, _monitoring_stats_stream.createMonitoringStatsStream)((0, _monitoring_stats_stream.createAggregators)(taskPollingLifecycle, taskStore, elasticsearchAndSOAvailability$, config, managedConfig, logger), config);
}