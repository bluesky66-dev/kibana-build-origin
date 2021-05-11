"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBucketMaxMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _bucket_max_fn = require("./bucket_max_fn");

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
const overallMaxLabel = _i18n.i18n.translate('data.search.aggs.metrics.overallMaxLabel', {
  defaultMessage: 'overall max'
});

const maxBucketTitle = _i18n.i18n.translate('data.search.aggs.metrics.maxBucketTitle', {
  defaultMessage: 'Max Bucket'
});

const getBucketMaxMetricAgg = () => {
  const {
    subtype,
    params,
    getSerializedFormat
  } = _sibling_pipeline_agg_helper.siblingPipelineAggHelper;
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.MAX_BUCKET,
    expressionName: _bucket_max_fn.aggBucketMaxFnName,
    title: maxBucketTitle,
    makeLabel: agg => (0, _make_nested_label.makeNestedLabel)(agg, overallMaxLabel),
    subtype,
    params: [...params()],
    getSerializedFormat
  });
};

exports.getBucketMaxMetricAgg = getBucketMaxMetricAgg;