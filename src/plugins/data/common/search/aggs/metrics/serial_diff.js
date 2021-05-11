"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSerialDiffMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _metric_agg_type = require("./metric_agg_type");

var _serial_diff_fn = require("./serial_diff_fn");

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
const serialDiffTitle = _i18n.i18n.translate('data.search.aggs.metrics.serialDiffTitle', {
  defaultMessage: 'Serial Diff'
});

const serialDiffLabel = _i18n.i18n.translate('data.search.aggs.metrics.serialDiffLabel', {
  defaultMessage: 'serial diff'
});

const getSerialDiffMetricAgg = () => {
  const {
    subtype,
    params,
    getSerializedFormat
  } = _parent_pipeline_agg_helper.parentPipelineAggHelper;
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.SERIAL_DIFF,
    expressionName: _serial_diff_fn.aggSerialDiffFnName,
    title: serialDiffTitle,
    makeLabel: agg => (0, _make_nested_label.makeNestedLabel)(agg, serialDiffLabel),
    subtype,
    params: [...params()],
    getSerializedFormat
  });
};

exports.getSerialDiffMetricAgg = getSerialDiffMetricAgg;