"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.percentile = percentile;

var _lodash = require("lodash");

var _get_splits = require("../../helpers/get_splits");

var _get_last_metric = require("../../helpers/get_last_metric");

var _to_percentile_number = require("../../../../../common/to_percentile_number");

var _metric_types = require("../../../../../common/metric_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function percentile(bucket, panel, series, meta, extractFields) {
  return next => async results => {
    const metric = (0, _get_last_metric.getLastMetric)(series);

    if (metric.type !== _metric_types.METRIC_TYPES.PERCENTILE) {
      return next(results);
    }

    const fakeResp = {
      aggregations: bucket
    };
    (await (0, _get_splits.getSplits)(fakeResp, panel, series, meta, extractFields)).forEach(split => {
      var _percentile$value;

      // table allows only one percentile in a series (the last one will be chosen in case of several)
      const percentile = (0, _lodash.last)(metric.percentiles);
      const percentileKey = (0, _to_percentile_number.toPercentileNumber)(percentile.value);
      const data = split.timeseries.buckets.map(bucket => [bucket.key, bucket[metric.id].values[percentileKey]]);
      results.push({
        id: split.id,
        label: `${split.label} (${(_percentile$value = percentile.value) !== null && _percentile$value !== void 0 ? _percentile$value : 0})`,
        data
      });
    });
    return next(results);
  };
}