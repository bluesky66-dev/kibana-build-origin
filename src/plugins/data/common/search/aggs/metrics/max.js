"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _max_fn = require("./max_fn");

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
const maxTitle = _i18n.i18n.translate('data.search.aggs.metrics.maxTitle', {
  defaultMessage: 'Max'
});

const getMaxMetricAgg = () => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.MAX,
    expressionName: _max_fn.aggMaxFnName,
    title: maxTitle,

    makeLabel(aggConfig) {
      return _i18n.i18n.translate('data.search.aggs.metrics.maxLabel', {
        defaultMessage: 'Max {field}',
        values: {
          field: aggConfig.getFieldDisplayName()
        }
      });
    },

    params: [{
      name: 'field',
      type: 'field',
      filterFieldTypes: [_common.KBN_FIELD_TYPES.NUMBER, _common.KBN_FIELD_TYPES.DATE, _common.KBN_FIELD_TYPES.HISTOGRAM]
    }]
  });
};

exports.getMaxMetricAgg = getMaxMetricAgg;