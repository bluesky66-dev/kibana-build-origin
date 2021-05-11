"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetrics = getMetrics;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _bluebird = _interopRequireDefault(require("bluebird"));

var _error_missing_required = require("../error_missing_required");

var _get_series = require("./get_series");

var _calculate_timeseries_interval = require("../calculate_timeseries_interval");

var _get_timezone = require("../get_timezone");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getMetrics(req, indexPattern, metricSet = [], filters = [], metricOptions = {}, numOfBuckets = 0, groupBy = null) {
  (0, _error_missing_required.checkParam)(indexPattern, 'indexPattern in details/getMetrics');
  (0, _error_missing_required.checkParam)(metricSet, 'metricSet in details/getMetrics');
  const config = req.server.config(); // TODO: Pass in req parameters as explicit function parameters

  let min = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const max = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const minIntervalSeconds = config.get('monitoring.ui.min_interval_seconds');
  const bucketSize = (0, _calculate_timeseries_interval.calculateTimeseriesInterval)(min, max, minIntervalSeconds);
  const timezone = await (0, _get_timezone.getTimezone)(req); // If specified, adjust the time period to ensure we only return this many buckets

  if (numOfBuckets > 0) {
    min = max - numOfBuckets * bucketSize * 1000;
  }

  return _bluebird.default.map(metricSet, metric => {
    // metric names match the literal metric name, but they can be supplied in groups or individually
    let metricNames;

    if ((0, _lodash.isPlainObject)(metric)) {
      metricNames = metric.keys;
    } else {
      metricNames = [metric];
    }

    return _bluebird.default.map(metricNames, metricName => {
      return (0, _get_series.getSeries)(req, indexPattern, metricName, metricOptions, filters, groupBy, {
        min,
        max,
        bucketSize,
        timezone
      });
    });
  }).then(rows => {
    const data = {};
    metricSet.forEach((key, index) => {
      // keyName must match the value stored in the html template
      const keyName = (0, _lodash.isPlainObject)(key) ? key.name : key;
      data[keyName] = rows[index];
    });
    return data;
  });
}