"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPercentilesMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _metric_agg_type = require("./metric_agg_type");

var _metric_agg_types = require("./metric_agg_types");

var _common = require("../../../../common");

var _get_response_agg_config_class = require("./lib/get_response_agg_config_class");

var _percentiles_fn = require("./percentiles_fn");

var _percentiles_get_value = require("./percentiles_get_value");

var _ordinal_suffix = require("./lib/ordinal_suffix");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const valueProps = {
  makeLabel() {
    const customLabel = this.getParam('customLabel');
    const label = customLabel || this.getFieldDisplayName();
    return _i18n.i18n.translate('data.search.aggs.metrics.percentiles.valuePropsLabel', {
      defaultMessage: '{percentile} percentile of {label}',
      values: {
        percentile: (0, _ordinal_suffix.ordinalSuffix)(this.key),
        label
      }
    });
  }

};

const getPercentilesMetricAgg = () => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.PERCENTILES,
    expressionName: _percentiles_fn.aggPercentilesFnName,
    title: _i18n.i18n.translate('data.search.aggs.metrics.percentilesTitle', {
      defaultMessage: 'Percentiles'
    }),

    makeLabel(agg) {
      return _i18n.i18n.translate('data.search.aggs.metrics.percentilesLabel', {
        defaultMessage: 'Percentiles of {field}',
        values: {
          field: agg.getFieldDisplayName()
        }
      });
    },

    params: [{
      name: 'field',
      type: 'field',
      filterFieldTypes: [_common.KBN_FIELD_TYPES.NUMBER, _common.KBN_FIELD_TYPES.DATE, _common.KBN_FIELD_TYPES.HISTOGRAM]
    }, {
      name: 'percents',
      default: [1, 5, 25, 50, 75, 95, 99]
    }, {
      write(agg, output) {
        output.params.keyed = false;
      }

    }],

    getResponseAggs(agg) {
      const ValueAggConfig = (0, _get_response_agg_config_class.getResponseAggConfigClass)(agg, valueProps);
      return agg.getParam('percents').map(percent => new ValueAggConfig(percent));
    },

    getValue: _percentiles_get_value.getPercentileValue
  });
};

exports.getPercentilesMetricAgg = getPercentilesMetricAgg;