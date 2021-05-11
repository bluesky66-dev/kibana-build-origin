"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMovingAvgMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _metric_agg_type = require("./metric_agg_type");

var _moving_avg_fn = require("./moving_avg_fn");

var _parent_pipeline_agg_helper = require("./lib/parent_pipeline_agg_helper");

var _make_nested_label = require("./lib/make_nested_label");

var _metric_agg_types = require("./metric_agg_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const movingAvgTitle = _i18n.i18n.translate('data.search.aggs.metrics.movingAvgTitle', {
  defaultMessage: 'Moving Avg'
});

const movingAvgLabel = _i18n.i18n.translate('data.search.aggs.metrics.movingAvgLabel', {
  defaultMessage: 'moving avg'
});

const getMovingAvgMetricAgg = () => {
  const {
    subtype,
    params,
    getSerializedFormat
  } = _parent_pipeline_agg_helper.parentPipelineAggHelper;
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.MOVING_FN,
    expressionName: _moving_avg_fn.aggMovingAvgFnName,
    dslName: 'moving_fn',
    title: movingAvgTitle,
    makeLabel: agg => (0, _make_nested_label.makeNestedLabel)(agg, movingAvgLabel),
    subtype,
    getSerializedFormat,
    params: [...params(), {
      name: 'window',
      default: 5
    }, {
      name: 'script',
      default: 'MovingFunctions.unweightedAvg(values)'
    }],

    getValue(agg, bucket) {
      /**
       * The previous implementation using `moving_avg` did not
       * return any bucket in case there are no documents or empty window.
       * The `moving_fn` aggregation returns buckets with the value null if the
       * window is empty or doesn't return any value if the sibiling metric
       * is null. Since our generic MetricAggType.getValue implementation
       * would return the value 0 for null buckets, we need a specific
       * implementation here, that preserves the null value.
       */
      return bucket[agg.id] ? bucket[agg.id].value : null;
    }

  });
};

exports.getMovingAvgMetricAgg = getMovingAvgMetricAgg;