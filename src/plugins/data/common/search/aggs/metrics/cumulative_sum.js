"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCumulativeSumMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _cumulative_sum_fn = require("./cumulative_sum_fn");

var _metric_agg_type = require("./metric_agg_type");

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
const cumulativeSumLabel = _i18n.i18n.translate('data.search.aggs.metrics.cumulativeSumLabel', {
  defaultMessage: 'cumulative sum'
});

const cumulativeSumTitle = _i18n.i18n.translate('data.search.aggs.metrics.cumulativeSumTitle', {
  defaultMessage: 'Cumulative Sum'
});

const getCumulativeSumMetricAgg = () => {
  const {
    subtype,
    params,
    getSerializedFormat
  } = _parent_pipeline_agg_helper.parentPipelineAggHelper;
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.CUMULATIVE_SUM,
    expressionName: _cumulative_sum_fn.aggCumulativeSumFnName,
    title: cumulativeSumTitle,
    makeLabel: agg => (0, _make_nested_label.makeNestedLabel)(agg, cumulativeSumLabel),
    subtype,
    params: [...params()],
    getSerializedFormat
  });
};

exports.getCumulativeSumMetricAgg = getCumulativeSumMetricAgg;