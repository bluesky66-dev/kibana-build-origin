"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBasicAgg = isBasicAgg;
exports.lookup = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const lookup = {
  count: _i18n.i18n.translate('visTypeTimeseries.aggLookup.countLabel', {
    defaultMessage: 'Count'
  }),
  calculation: _i18n.i18n.translate('visTypeTimeseries.aggLookup.calculationLabel', {
    defaultMessage: 'Calculation'
  }),
  std_deviation: _i18n.i18n.translate('visTypeTimeseries.aggLookup.deviationLabel', {
    defaultMessage: 'Std. Deviation'
  }),
  variance: _i18n.i18n.translate('visTypeTimeseries.aggLookup.varianceLabel', {
    defaultMessage: 'Variance'
  }),
  sum_of_squares: _i18n.i18n.translate('visTypeTimeseries.aggLookup.sumOfSqLabel', {
    defaultMessage: 'Sum of Sq.'
  }),
  avg: _i18n.i18n.translate('visTypeTimeseries.aggLookup.averageLabel', {
    defaultMessage: 'Average'
  }),
  max: _i18n.i18n.translate('visTypeTimeseries.aggLookup.maxLabel', {
    defaultMessage: 'Max'
  }),
  min: _i18n.i18n.translate('visTypeTimeseries.aggLookup.minLabel', {
    defaultMessage: 'Min'
  }),
  sum: _i18n.i18n.translate('visTypeTimeseries.aggLookup.sumLabel', {
    defaultMessage: 'Sum'
  }),
  percentile: _i18n.i18n.translate('visTypeTimeseries.aggLookup.percentileLabel', {
    defaultMessage: 'Percentile'
  }),
  percentile_rank: _i18n.i18n.translate('visTypeTimeseries.aggLookup.percentileRankLabel', {
    defaultMessage: 'Percentile Rank'
  }),
  cardinality: _i18n.i18n.translate('visTypeTimeseries.aggLookup.cardinalityLabel', {
    defaultMessage: 'Cardinality'
  }),
  value_count: _i18n.i18n.translate('visTypeTimeseries.aggLookup.valueCountLabel', {
    defaultMessage: 'Value Count'
  }),
  derivative: _i18n.i18n.translate('visTypeTimeseries.aggLookup.derivativeLabel', {
    defaultMessage: 'Derivative'
  }),
  cumulative_sum: _i18n.i18n.translate('visTypeTimeseries.aggLookup.cumulativeSumLabel', {
    defaultMessage: 'Cumulative Sum'
  }),
  moving_average: _i18n.i18n.translate('visTypeTimeseries.aggLookup.movingAverageLabel', {
    defaultMessage: 'Moving Average'
  }),
  avg_bucket: _i18n.i18n.translate('visTypeTimeseries.aggLookup.overallAverageLabel', {
    defaultMessage: 'Overall Average'
  }),
  min_bucket: _i18n.i18n.translate('visTypeTimeseries.aggLookup.overallMinLabel', {
    defaultMessage: 'Overall Min'
  }),
  max_bucket: _i18n.i18n.translate('visTypeTimeseries.aggLookup.overallMaxLabel', {
    defaultMessage: 'Overall Max'
  }),
  sum_bucket: _i18n.i18n.translate('visTypeTimeseries.aggLookup.overallSumLabel', {
    defaultMessage: 'Overall Sum'
  }),
  variance_bucket: _i18n.i18n.translate('visTypeTimeseries.aggLookup.overallVarianceLabel', {
    defaultMessage: 'Overall Variance'
  }),
  sum_of_squares_bucket: _i18n.i18n.translate('visTypeTimeseries.aggLookup.overallSumOfSqLabel', {
    defaultMessage: 'Overall Sum of Sq.'
  }),
  std_deviation_bucket: _i18n.i18n.translate('visTypeTimeseries.aggLookup.overallStdDeviationLabel', {
    defaultMessage: 'Overall Std. Deviation'
  }),
  series_agg: _i18n.i18n.translate('visTypeTimeseries.aggLookup.seriesAggLabel', {
    defaultMessage: 'Series Agg'
  }),
  math: _i18n.i18n.translate('visTypeTimeseries.aggLookup.mathLabel', {
    defaultMessage: 'Math'
  }),
  serial_diff: _i18n.i18n.translate('visTypeTimeseries.aggLookup.serialDifferenceLabel', {
    defaultMessage: 'Serial Difference'
  }),
  filter_ratio: _i18n.i18n.translate('visTypeTimeseries.aggLookup.filterRatioLabel', {
    defaultMessage: 'Filter Ratio'
  }),
  positive_only: _i18n.i18n.translate('visTypeTimeseries.aggLookup.positiveOnlyLabel', {
    defaultMessage: 'Positive Only'
  }),
  static: _i18n.i18n.translate('visTypeTimeseries.aggLookup.staticValueLabel', {
    defaultMessage: 'Static Value'
  }),
  top_hit: _i18n.i18n.translate('visTypeTimeseries.aggLookup.topHitLabel', {
    defaultMessage: 'Top Hit'
  }),
  positive_rate: _i18n.i18n.translate('visTypeTimeseries.aggLookup.positiveRateLabel', {
    defaultMessage: 'Counter Rate'
  })
};
exports.lookup = lookup;
const pipeline = ['calculation', 'derivative', 'cumulative_sum', 'moving_average', 'avg_bucket', 'min_bucket', 'max_bucket', 'sum_bucket', 'variance_bucket', 'sum_of_squares_bucket', 'std_deviation_bucket', 'series_agg', 'math', 'serial_diff', 'positive_only'];
const byType = {
  _all: lookup,
  pipeline,
  basic: (0, _lodash.omit)(lookup, pipeline),
  metrics: (0, _lodash.pick)(lookup, ['count', 'avg', 'min', 'max', 'sum', 'cardinality', 'value_count'])
};

function isBasicAgg(item) {
  return (0, _lodash.includes)(Object.keys(byType.basic), item.type);
}