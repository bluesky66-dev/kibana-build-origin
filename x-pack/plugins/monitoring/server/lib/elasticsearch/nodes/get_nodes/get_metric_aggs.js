"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricAggs = getMetricAggs;

var _metrics = require("../../../metrics");

var _constants = require("../../../../../common/constants");

var _convert_metric_names = require("../../convert_metric_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Create the DSL for date histogram aggregations based on an array of metric names
 * NOTE: Issue https://github.com/elastic/x-pack-kibana/issues/332 would be
 * addressed if chart data aggregations used a module like this
 *
 * @param {Array} listingMetrics: Array of metric names (See server/lib/metrics/metrics.js)
 * @param {Number} bucketSize: Bucket size in seconds for date histogram interval
 * @return {Object} Aggregation DSL
 */


function getMetricAggs(listingMetrics) {
  let aggItems = {};
  listingMetrics.forEach(metricName => {
    const metric = _metrics.metrics[metricName];
    let metricAgg = null;

    if (!metric) {
      return;
    }

    if (!metric.aggs) {
      // if metric does not have custom agg defined
      metricAgg = {
        metric: {
          [metric.metricAgg]: {
            // max, sum, etc
            field: metric.field
          }
        },
        metric_deriv: {
          derivative: {
            buckets_path: 'metric',
            unit: _constants.NORMALIZED_DERIVATIVE_UNIT
          }
        }
      };
    }

    aggItems = { ...aggItems,
      ...(0, _convert_metric_names.convertMetricNames)(metricName, metric.aggs || metricAgg)
    };
  });
  return aggItems;
}