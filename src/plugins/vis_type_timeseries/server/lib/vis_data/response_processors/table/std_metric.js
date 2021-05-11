"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stdMetric = stdMetric;

var _get_splits = require("../../helpers/get_splits");

var _get_last_metric = require("../../helpers/get_last_metric");

var _map_bucket = require("../../helpers/map_bucket");

var _metric_types = require("../../../../../common/metric_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function stdMetric(bucket, panel, series, meta, extractFields) {
  return next => async results => {
    const metric = (0, _get_last_metric.getLastMetric)(series);

    if (metric.type === _metric_types.METRIC_TYPES.STD_DEVIATION && metric.mode === 'band') {
      return next(results);
    }

    if ([_metric_types.METRIC_TYPES.PERCENTILE_RANK, _metric_types.METRIC_TYPES.PERCENTILE].includes(metric.type)) {
      return next(results);
    }

    if (/_bucket$/.test(metric.type)) {
      return next(results);
    }

    const fakeResp = {
      aggregations: bucket
    };
    (await (0, _get_splits.getSplits)(fakeResp, panel, series, meta, extractFields)).forEach(split => {
      const data = split.timeseries.buckets.map((0, _map_bucket.mapBucket)(metric));
      results.push({
        id: split.id,
        label: split.label,
        data
      });
    });
    return next(results);
  };
}