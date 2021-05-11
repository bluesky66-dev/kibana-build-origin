"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapBucket = mapBucket;

var _get_agg_value = require("./get_agg_value");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function mapBucket(metric) {
  return bucket => [bucket.key, (0, _get_agg_value.getAggValue)(bucket, metric)];
}