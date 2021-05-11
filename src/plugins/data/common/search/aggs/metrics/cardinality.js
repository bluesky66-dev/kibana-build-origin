"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCardinalityMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _cardinality_fn = require("./cardinality_fn");

var _metric_agg_type = require("./metric_agg_type");

var _metric_agg_types = require("./metric_agg_types");

var _common = require("../../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const uniqueCountTitle = _i18n.i18n.translate('data.search.aggs.metrics.uniqueCountTitle', {
  defaultMessage: 'Unique Count'
});

const getCardinalityMetricAgg = () => new _metric_agg_type.MetricAggType({
  name: _metric_agg_types.METRIC_TYPES.CARDINALITY,
  valueType: 'number',
  expressionName: _cardinality_fn.aggCardinalityFnName,
  title: uniqueCountTitle,

  makeLabel(aggConfig) {
    return _i18n.i18n.translate('data.search.aggs.metrics.uniqueCountLabel', {
      defaultMessage: 'Unique count of {field}',
      values: {
        field: aggConfig.getFieldDisplayName()
      }
    });
  },

  getSerializedFormat(agg) {
    return {
      id: 'number'
    };
  },

  params: [{
    name: 'field',
    type: 'field',
    filterFieldTypes: Object.values(_common.KBN_FIELD_TYPES).filter(type => type !== _common.KBN_FIELD_TYPES.HISTOGRAM)
  }]
});

exports.getCardinalityMetricAgg = getCardinalityMetricAgg;