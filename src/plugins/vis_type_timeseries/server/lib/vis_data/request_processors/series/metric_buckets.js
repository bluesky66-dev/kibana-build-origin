"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricBuckets = metricBuckets;

var _helpers = require("../../helpers");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _bucket_transform = require("../../helpers/bucket_transform");

var _get_interval_and_timefield = require("../../get_interval_and_timefield");

var _common = require("../../../../../../data/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function metricBuckets(req, panel, series, esQueryConfig, indexPatternObject, capabilities, uiSettings) {
  return next => async doc => {
    const barTargetUiSettings = await uiSettings.get(_common.UI_SETTINGS.HISTOGRAM_BAR_TARGET);
    const {
      interval
    } = (0, _get_interval_and_timefield.getIntervalAndTimefield)(panel, series, indexPatternObject);
    const {
      intervalString
    } = (0, _get_bucket_size.getBucketSize)(req, interval, capabilities, barTargetUiSettings);
    series.metrics.filter(row => !/_bucket$/.test(row.type) && !/^series/.test(row.type)).forEach(metric => {
      const fn = _bucket_transform.bucketTransform[metric.type];

      if (fn) {
        try {
          const bucket = fn(metric, series.metrics, intervalString);
          (0, _helpers.overwrite)(doc, `aggs.${series.id}.aggs.timeseries.aggs.${metric.id}`, bucket);
        } catch (e) {// meh
        }
      }
    });
    return next(doc);
  };
}