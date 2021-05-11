"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDerivativeMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _derivative_fn = require("./derivative_fn");

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
const derivativeLabel = _i18n.i18n.translate('data.search.aggs.metrics.derivativeLabel', {
  defaultMessage: 'derivative'
});

const derivativeTitle = _i18n.i18n.translate('data.search.aggs.metrics.derivativeTitle', {
  defaultMessage: 'Derivative'
});

const getDerivativeMetricAgg = () => {
  const {
    subtype,
    params,
    getSerializedFormat
  } = _parent_pipeline_agg_helper.parentPipelineAggHelper;
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.DERIVATIVE,
    expressionName: _derivative_fn.aggDerivativeFnName,
    title: derivativeTitle,

    makeLabel(agg) {
      return (0, _make_nested_label.makeNestedLabel)(agg, derivativeLabel);
    },

    subtype,
    params: [...params()],
    getSerializedFormat
  });
};

exports.getDerivativeMetricAgg = getDerivativeMetricAgg;