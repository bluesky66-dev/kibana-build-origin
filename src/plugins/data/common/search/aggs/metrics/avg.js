"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAvgMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _avg_fn = require("./avg_fn");

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
const averageTitle = _i18n.i18n.translate('data.search.aggs.metrics.averageTitle', {
  defaultMessage: 'Average'
});

const getAvgMetricAgg = () => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.AVG,
    expressionName: _avg_fn.aggAvgFnName,
    title: averageTitle,
    makeLabel: aggConfig => {
      return _i18n.i18n.translate('data.search.aggs.metrics.averageLabel', {
        defaultMessage: 'Average {field}',
        values: {
          field: aggConfig.getFieldDisplayName()
        }
      });
    },
    params: [{
      name: 'field',
      type: 'field',
      filterFieldTypes: [_common.KBN_FIELD_TYPES.NUMBER, _common.KBN_FIELD_TYPES.HISTOGRAM]
    }]
  });
};

exports.getAvgMetricAgg = getAvgMetricAgg;