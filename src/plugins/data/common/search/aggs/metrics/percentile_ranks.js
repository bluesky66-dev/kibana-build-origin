"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPercentileRanksMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _common = require("../../../../common");

var _metric_agg_type = require("./metric_agg_type");

var _get_response_agg_config_class = require("./lib/get_response_agg_config_class");

var _percentile_ranks_fn = require("./percentile_ranks_fn");

var _percentiles_get_value = require("./percentiles_get_value");

var _metric_agg_types = require("./metric_agg_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getValueProps = getFieldFormatsStart => {
  return {
    makeLabel() {
      const {
        getDefaultInstance
      } = getFieldFormatsStart();
      const field = this.getField();
      const format = field && field.format || getDefaultInstance(_common.KBN_FIELD_TYPES.NUMBER);
      const customLabel = this.getParam('customLabel');
      const label = customLabel || this.getFieldDisplayName();
      return _i18n.i18n.translate('data.search.aggs.metrics.percentileRanks.valuePropsLabel', {
        defaultMessage: 'Percentile rank {format} of "{label}"',
        values: {
          format: format.convert(this.key, 'text'),
          label
        }
      });
    }

  };
};

const getPercentileRanksMetricAgg = ({
  getFieldFormatsStart
}) => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.PERCENTILE_RANKS,
    expressionName: _percentile_ranks_fn.aggPercentileRanksFnName,
    title: _i18n.i18n.translate('data.search.aggs.metrics.percentileRanksTitle', {
      defaultMessage: 'Percentile Ranks'
    }),

    makeLabel(agg) {
      return _i18n.i18n.translate('data.search.aggs.metrics.percentileRanksLabel', {
        defaultMessage: 'Percentile ranks of {field}',
        values: {
          field: agg.getFieldDisplayName()
        }
      });
    },

    params: [{
      name: 'field',
      type: 'field',
      filterFieldTypes: [_common.KBN_FIELD_TYPES.NUMBER, _common.KBN_FIELD_TYPES.HISTOGRAM]
    }, {
      name: 'values',
      default: []
    }, {
      write(agg, output) {
        output.params.keyed = false;
      }

    }],

    getResponseAggs(agg) {
      const ValueAggConfig = (0, _get_response_agg_config_class.getResponseAggConfigClass)(agg, getValueProps(getFieldFormatsStart));
      const values = agg.getParam('values');
      return values.map(value => new ValueAggConfig(value));
    },

    getSerializedFormat(agg) {
      return {
        id: 'percent'
      };
    },

    getValue(agg, bucket) {
      return (0, _percentiles_get_value.getPercentileValue)(agg, bucket) / 100;
    }

  });
};

exports.getPercentileRanksMetricAgg = getPercentileRanksMetricAgg;