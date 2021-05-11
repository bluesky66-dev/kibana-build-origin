"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROUTES = exports.AUTO_INTERVAL = exports.INDEXES_SEPARATOR = exports.MAX_BUCKETS_SETTING = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const MAX_BUCKETS_SETTING = 'metrics:max_buckets';
exports.MAX_BUCKETS_SETTING = MAX_BUCKETS_SETTING;
const INDEXES_SEPARATOR = ',';
exports.INDEXES_SEPARATOR = INDEXES_SEPARATOR;
const AUTO_INTERVAL = 'auto';
exports.AUTO_INTERVAL = AUTO_INTERVAL;
const ROUTES = {
  VIS_DATA: '/api/metrics/vis/data',
  FIELDS: '/api/metrics/fields'
};
exports.ROUTES = ROUTES;