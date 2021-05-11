"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCountMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _count_fn = require("./count_fn");

var _metric_agg_type = require("./metric_agg_type");

var _metric_agg_types = require("./metric_agg_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getCountMetricAgg = () => new _metric_agg_type.MetricAggType({
  name: _metric_agg_types.METRIC_TYPES.COUNT,
  expressionName: _count_fn.aggCountFnName,
  title: _i18n.i18n.translate('data.search.aggs.metrics.countTitle', {
    defaultMessage: 'Count'
  }),
  hasNoDsl: true,
  json: false,

  makeLabel() {
    return _i18n.i18n.translate('data.search.aggs.metrics.countLabel', {
      defaultMessage: 'Count'
    });
  },

  getSerializedFormat(agg) {
    return {
      id: 'number'
    };
  },

  getValue(agg, bucket) {
    return bucket.doc_count;
  },

  isScalable() {
    return true;
  }

});

exports.getCountMetricAgg = getCountMetricAgg;