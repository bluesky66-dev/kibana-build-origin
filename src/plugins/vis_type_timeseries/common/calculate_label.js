"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateLabel = exports.extractFieldLabel = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _agg_lookup = require("./agg_lookup");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const paths = ['cumulative_sum', 'derivative', 'moving_average', 'avg_bucket', 'sum_bucket', 'min_bucket', 'max_bucket', 'std_deviation_bucket', 'variance_bucket', 'sum_of_squares_bucket', 'serial_diff', 'positive_only'];

const extractFieldLabel = (fields, name) => {
  var _fields$find$label, _fields$find;

  return (_fields$find$label = (_fields$find = fields.find(f => f.name === name)) === null || _fields$find === void 0 ? void 0 : _fields$find.label) !== null && _fields$find$label !== void 0 ? _fields$find$label : name;
};

exports.extractFieldLabel = extractFieldLabel;

const calculateLabel = (metric, metrics = [], fields = []) => {
  if (!metric) {
    return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.unknownLabel', {
      defaultMessage: 'Unknown'
    });
  }

  if (metric.alias) {
    return metric.alias;
  }

  if (metric.type === 'count') {
    return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.countLabel', {
      defaultMessage: 'Count'
    });
  }

  if (metric.type === 'calculation') {
    return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.bucketScriptsLabel', {
      defaultMessage: 'Bucket Script'
    });
  }

  if (metric.type === 'math') {
    return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.mathLabel', {
      defaultMessage: 'Math'
    });
  }

  if (metric.type === 'series_agg') {
    return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.seriesAggLabel', {
      defaultMessage: 'Series Agg ({metricFunction})',
      values: {
        metricFunction: metric.function
      }
    });
  }

  if (metric.type === 'filter_ratio') {
    return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.filterRatioLabel', {
      defaultMessage: 'Filter Ratio'
    });
  }

  if (metric.type === 'positive_rate') {
    return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.positiveRateLabel', {
      defaultMessage: 'Counter Rate of {field}',
      values: {
        field: extractFieldLabel(fields, metric.field)
      }
    });
  }

  if (metric.type === 'static') {
    return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.staticValueLabel', {
      defaultMessage: 'Static Value of {metricValue}',
      values: {
        metricValue: metric.value
      }
    });
  }

  if ((0, _lodash.includes)(paths, metric.type)) {
    const targetMetric = metrics.find(m => (0, _lodash.startsWith)(metric.field, m.id));
    const targetLabel = calculateLabel(targetMetric, metrics, fields); // For percentiles we need to parse the field id to extract the percentile
    // the user configured in the percentile aggregation and specified in the
    // submetric they selected. This applies only to pipeline aggs.

    if (targetMetric && targetMetric.type === 'percentile') {
      const percentileValueMatch = /\[([0-9\.]+)\]$/;
      const matches = metric.field.match(percentileValueMatch);

      if (matches) {
        return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.lookupMetricTypeOfTargetWithAdditionalLabel', {
          defaultMessage: '{lookupMetricType} of {targetLabel} ({additionalLabel})',
          values: {
            lookupMetricType: _agg_lookup.lookup[metric.type],
            targetLabel,
            additionalLabel: matches[1]
          }
        });
      }
    }

    return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.lookupMetricTypeOfTargetLabel', {
      defaultMessage: '{lookupMetricType} of {targetLabel}',
      values: {
        lookupMetricType: _agg_lookup.lookup[metric.type],
        targetLabel
      }
    });
  }

  return _i18n.i18n.translate('visTypeTimeseries.calculateLabel.lookupMetricTypeOfMetricFieldRankLabel', {
    defaultMessage: '{lookupMetricType} of {metricField}',
    values: {
      lookupMetricType: _agg_lookup.lookup[metric.type],
      metricField: extractFieldLabel(fields, metric.field)
    }
  });
};

exports.calculateLabel = calculateLabel;