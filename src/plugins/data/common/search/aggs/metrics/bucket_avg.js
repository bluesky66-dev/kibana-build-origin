"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBucketAvgMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _bucket_avg_fn = require("./bucket_avg_fn");

var _metric_agg_type = require("./metric_agg_type");

var _make_nested_label = require("./lib/make_nested_label");

var _sibling_pipeline_agg_helper = require("./lib/sibling_pipeline_agg_helper");

var _metric_agg_types = require("./metric_agg_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const overallAverageLabel = _i18n.i18n.translate('data.search.aggs.metrics.overallAverageLabel', {
  defaultMessage: 'overall average'
});

const averageBucketTitle = _i18n.i18n.translate('data.search.aggs.metrics.averageBucketTitle', {
  defaultMessage: 'Average Bucket'
});

const getBucketAvgMetricAgg = () => {
  const {
    subtype,
    params,
    getSerializedFormat
  } = _sibling_pipeline_agg_helper.siblingPipelineAggHelper;
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.AVG_BUCKET,
    expressionName: _bucket_avg_fn.aggBucketAvgFnName,
    title: averageBucketTitle,
    makeLabel: agg => (0, _make_nested_label.makeNestedLabel)(agg, overallAverageLabel),
    subtype,
    params: [...params()],
    getSerializedFormat,

    getValue(agg, bucket) {
      const customMetric = agg.getParam('customMetric');
      const customBucket = agg.getParam('customBucket');
      const scaleMetrics = customMetric.type && customMetric.type.isScalable();
      let value = bucket[agg.id] && bucket[agg.id].value;

      if (scaleMetrics && customBucket.type.name === 'date_histogram') {
        const aggInfo = customBucket.write();
        value *= (0, _lodash.get)(aggInfo, 'bucketInterval.scale', 1);
      }

      return value;
    }

  });
};

exports.getBucketAvgMetricAgg = getBucketAvgMetricAgg;