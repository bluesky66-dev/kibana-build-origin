"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIMESTAMP_FIELD = exports.LOGS_INDEX_PATTERN = exports.METRICS_INDEX_PATTERN = exports.DEFAULT_SOURCE_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_SOURCE_ID = 'default';
exports.DEFAULT_SOURCE_ID = DEFAULT_SOURCE_ID;
const METRICS_INDEX_PATTERN = 'metrics-*,metricbeat-*';
exports.METRICS_INDEX_PATTERN = METRICS_INDEX_PATTERN;
const LOGS_INDEX_PATTERN = 'logs-*,filebeat-*,kibana_sample_data_logs*';
exports.LOGS_INDEX_PATTERN = LOGS_INDEX_PATTERN;
const TIMESTAMP_FIELD = '@timestamp';
exports.TIMESTAMP_FIELD = TIMESTAMP_FIELD;