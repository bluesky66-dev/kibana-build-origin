"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStdDeviationMetricAgg = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _metric_agg_type = require("./metric_agg_type");

var _std_deviation_fn = require("./std_deviation_fn");

var _metric_agg_types = require("./metric_agg_types");

var _get_response_agg_config_class = require("./lib/get_response_agg_config_class");

var _common = require("../../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const responseAggConfigProps = {
  valProp() {
    const customLabel = this.getParam('customLabel');
    const details = this.keyedDetails(customLabel)[this.key];
    return details.valProp;
  },

  makeLabel() {
    const fieldDisplayName = this.getFieldDisplayName();
    const customLabel = this.getParam('customLabel');
    const details = this.keyedDetails(customLabel, fieldDisplayName);
    return (0, _lodash.get)(details, [this.key, 'title']);
  },

  keyedDetails(customLabel, fieldDisplayName) {
    const label = customLabel || _i18n.i18n.translate('data.search.aggs.metrics.standardDeviation.keyDetailsLabel', {
      defaultMessage: 'Standard Deviation of {fieldDisplayName}',
      values: {
        fieldDisplayName
      }
    });

    return {
      std_lower: {
        valProp: ['std_deviation_bounds', 'lower'],
        title: _i18n.i18n.translate('data.search.aggs.metrics.standardDeviation.lowerKeyDetailsTitle', {
          defaultMessage: 'Lower {label}',
          values: {
            label
          }
        })
      },
      std_upper: {
        valProp: ['std_deviation_bounds', 'upper'],
        title: _i18n.i18n.translate('data.search.aggs.metrics.standardDeviation.upperKeyDetailsTitle', {
          defaultMessage: 'Upper {label}',
          values: {
            label
          }
        })
      }
    };
  }

};

const getStdDeviationMetricAgg = () => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.STD_DEV,
    expressionName: _std_deviation_fn.aggStdDeviationFnName,
    dslName: 'extended_stats',
    title: _i18n.i18n.translate('data.search.aggs.metrics.standardDeviationTitle', {
      defaultMessage: 'Standard Deviation'
    }),

    makeLabel(agg) {
      return _i18n.i18n.translate('data.search.aggs.metrics.standardDeviationLabel', {
        defaultMessage: 'Standard Deviation of {field}',
        values: {
          field: agg.getFieldDisplayName()
        }
      });
    },

    params: [{
      name: 'field',
      type: 'field',
      filterFieldTypes: _common.KBN_FIELD_TYPES.NUMBER
    }],

    getResponseAggs(agg) {
      const ValueAggConfig = (0, _get_response_agg_config_class.getResponseAggConfigClass)(agg, responseAggConfigProps);
      return [new ValueAggConfig('std_lower'), new ValueAggConfig('std_upper')];
    },

    getValue(agg, bucket) {
      return (0, _lodash.get)(bucket[agg.parentId], agg.valProp());
    }

  });
};

exports.getStdDeviationMetricAgg = getStdDeviationMetricAgg;