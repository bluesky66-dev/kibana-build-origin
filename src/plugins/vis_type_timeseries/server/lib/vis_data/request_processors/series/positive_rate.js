"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.positiveRate = positiveRate;
exports.createPositiveRate = exports.filter = void 0;

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _get_interval_and_timefield = require("../../get_interval_and_timefield");

var _bucket_transform = require("../../helpers/bucket_transform");

var _helpers = require("../../helpers");

var _common = require("../../../../../../data/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const filter = metric => metric.type === 'positive_rate';

exports.filter = filter;

const createPositiveRate = (doc, intervalString, aggRoot) => metric => {
  const maxFn = _bucket_transform.bucketTransform.max;
  const derivativeFn = _bucket_transform.bucketTransform.derivative;
  const positiveOnlyFn = _bucket_transform.bucketTransform.positive_only;
  const maxMetric = {
    id: `${metric.id}-positive-rate-max`,
    type: 'max',
    field: metric.field
  };
  const derivativeMetric = {
    id: `${metric.id}-positive-rate-derivative`,
    type: 'derivative',
    field: `${metric.id}-positive-rate-max`,
    unit: metric.unit
  };
  const positiveOnlyMetric = {
    id: metric.id,
    type: 'positive_only',
    field: `${metric.id}-positive-rate-derivative`
  };
  const fakeSeriesMetrics = [maxMetric, derivativeMetric, positiveOnlyMetric];
  const maxBucket = maxFn(maxMetric, fakeSeriesMetrics, intervalString);
  const derivativeBucket = derivativeFn(derivativeMetric, fakeSeriesMetrics, intervalString);
  const positiveOnlyBucket = positiveOnlyFn(positiveOnlyMetric, fakeSeriesMetrics, intervalString);
  (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.aggs.${metric.id}-positive-rate-max`, maxBucket);
  (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.aggs.${metric.id}-positive-rate-derivative`, derivativeBucket);
  (0, _helpers.overwrite)(doc, `${aggRoot}.timeseries.aggs.${metric.id}`, positiveOnlyBucket);
};

exports.createPositiveRate = createPositiveRate;

function positiveRate(req, panel, series, esQueryConfig, indexPatternObject, capabilities, uiSettings) {
  return next => async doc => {
    const barTargetUiSettings = await uiSettings.get(_common.UI_SETTINGS.HISTOGRAM_BAR_TARGET);
    const {
      interval
    } = (0, _get_interval_and_timefield.getIntervalAndTimefield)(panel, series, indexPatternObject);
    const {
      intervalString
    } = (0, _get_bucket_size.getBucketSize)(req, interval, capabilities, barTargetUiSettings);

    if (series.metrics.some(filter)) {
      series.metrics.filter(filter).forEach(createPositiveRate(doc, intervalString, `aggs.${series.id}.aggs`));
      return next(doc);
    }

    return next(doc);
  };
}