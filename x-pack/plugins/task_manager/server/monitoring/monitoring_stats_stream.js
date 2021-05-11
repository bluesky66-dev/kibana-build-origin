"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAggregators = createAggregators;
exports.createMonitoringStatsStream = createMonitoringStatsStream;
exports.summarizeMonitoringStats = summarizeMonitoringStats;
Object.defineProperty(exports, "AggregatedStatProvider", {
  enumerable: true,
  get: function () {
    return _runtime_statistics_aggregator.AggregatedStatProvider;
  }
});
Object.defineProperty(exports, "AggregatedStat", {
  enumerable: true,
  get: function () {
    return _runtime_statistics_aggregator.AggregatedStat;
  }
});
exports.HealthStatus = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _workload_statistics = require("./workload_statistics");

var _task_run_statistics = require("./task_run_statistics");

var _configuration_statistics = require("./configuration_statistics");

var _runtime_statistics_aggregator = require("./runtime_statistics_aggregator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let HealthStatus;
exports.HealthStatus = HealthStatus;

(function (HealthStatus) {
  HealthStatus["OK"] = "OK";
  HealthStatus["Warning"] = "warn";
  HealthStatus["Error"] = "error";
})(HealthStatus || (exports.HealthStatus = HealthStatus = {}));

function createAggregators(taskPollingLifecycle, taskStore, elasticsearchAndSOAvailability$, config, managedConfig, logger) {
  return (0, _rxjs.merge)((0, _configuration_statistics.createConfigurationAggregator)(config, managedConfig), (0, _task_run_statistics.createTaskRunAggregator)(taskPollingLifecycle, config.monitored_stats_running_average_window), (0, _workload_statistics.createWorkloadAggregator)(taskStore, elasticsearchAndSOAvailability$, config.monitored_aggregated_stats_refresh_rate, config.poll_interval, logger));
}

function createMonitoringStatsStream(provider$, config) {
  const initialStats = {
    last_update: new Date().toISOString(),
    stats: {}
  };
  return (0, _rxjs.merge)( // emit the initial stats
  (0, _rxjs.of)(initialStats), // emit updated stats whenever a provider updates a specific key on the stats
  provider$.pipe((0, _operators.map)(({
    key,
    value
  }) => {
    return {
      value: {
        timestamp: new Date().toISOString(),
        value
      },
      key
    };
  }), (0, _operators.scan)((monitoringStats, {
    key,
    value
  }) => {
    // incrementally merge stats as they come in
    (0, _saferLodashSet.set)(monitoringStats.stats, key, value);
    monitoringStats.last_update = new Date().toISOString();
    return monitoringStats;
  }, initialStats)));
}

function summarizeMonitoringStats({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  last_update,
  stats: {
    runtime,
    workload,
    configuration
  }
}, config) {
  return {
    last_update,
    stats: { ...(configuration ? {
        configuration: { ...configuration,
          status: HealthStatus.OK
        }
      } : {}),
      ...(runtime ? {
        runtime: {
          timestamp: runtime.timestamp,
          ...(0, _task_run_statistics.summarizeTaskRunStat)(runtime.value, config)
        }
      } : {}),
      ...(workload ? {
        workload: {
          timestamp: workload.timestamp,
          ...(0, _workload_statistics.summarizeWorkloadStat)(workload.value)
        }
      } : {})
    }
  };
}