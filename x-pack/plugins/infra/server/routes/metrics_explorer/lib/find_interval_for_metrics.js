"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findIntervalForMetrics = void 0;

var _lodash = require("lodash");

var _lruCache = _interopRequireDefault(require("lru-cache"));

var _get_dataset_for_field = require("./get_dataset_for_field");

var _calculate_metric_interval = require("../../../utils/calculate_metric_interval");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const cache = new _lruCache.default({
  max: 100,
  maxAge: 15 * 60 * 1000
});

const findIntervalForMetrics = async (client, options) => {
  const fields = (0, _lodash.uniq)(options.metrics.map(metric => metric.field ? metric.field : null).filter(f => f));
  const cacheKey = fields.sort().join(':');
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  if (fields.length === 0) {
    return 60;
  }

  const modules = await Promise.all(fields.map(async field => await (0, _get_dataset_for_field.getDatasetForField)(client, field, options.indexPattern, options.timerange)));
  const interval = (0, _calculate_metric_interval.calculateMetricInterval)(client, {
    indexPattern: options.indexPattern,
    timestampField: options.timerange.field,
    timerange: options.timerange
  }, modules.filter(Boolean));
  cache.set(cacheKey, interval);
  return interval;
};

exports.findIntervalForMetrics = findIntervalForMetrics;