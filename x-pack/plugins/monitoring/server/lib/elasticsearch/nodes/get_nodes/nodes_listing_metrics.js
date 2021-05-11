"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LISTING_METRICS_PATHS = exports.LISTING_METRICS_NAMES = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// "listing metrics" is an array of metric objects from metrics/metrics.js
// used for getting some time series data to add to the response

const LISTING_METRICS_NAMES = ['node_cgroup_quota', 'node_cgroup_throttled', 'node_cpu_utilization', 'node_load_average', 'node_jvm_mem_percent', 'node_free_space'];
exports.LISTING_METRICS_NAMES = LISTING_METRICS_NAMES;
const LISTING_METRICS_PATHS = [`aggregations.nodes.buckets.by_date.buckets`];
exports.LISTING_METRICS_PATHS = LISTING_METRICS_PATHS;