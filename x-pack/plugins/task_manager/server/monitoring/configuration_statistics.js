"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfigurationAggregator = createConfigurationAggregator;

var _rxjs = require("rxjs");

var _lodash = require("lodash");

var _operators = require("rxjs/operators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CONFIG_FIELDS_TO_EXPOSE = ['request_capacity', 'max_poll_inactivity_cycles', 'monitored_aggregated_stats_refresh_rate', 'monitored_stats_running_average_window', 'monitored_task_execution_thresholds'];

function createConfigurationAggregator(config, managedConfig) {
  return (0, _rxjs.combineLatest)([(0, _rxjs.of)((0, _lodash.pick)(config, ...CONFIG_FIELDS_TO_EXPOSE)), managedConfig.pollIntervalConfiguration$.pipe((0, _operators.startWith)(config.poll_interval), (0, _operators.map)(pollInterval => ({
    poll_interval: pollInterval
  }))), managedConfig.maxWorkersConfiguration$.pipe((0, _operators.startWith)(config.max_workers), (0, _operators.map)(maxWorkers => ({
    max_workers: maxWorkers
  })))]).pipe((0, _operators.map)(configurations => ({
    key: 'configuration',
    value: (0, _lodash.merge)({}, ...configurations)
  })));
}