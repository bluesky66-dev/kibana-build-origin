"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stdDeviationBands = stdDeviationBands;

var _helpers = require("../../helpers");

var _metric_types = require("../../../../../common/metric_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function stdDeviationBands(resp, panel, series, meta, extractFields) {
  return next => async results => {
    const metric = (0, _helpers.getLastMetric)(series);

    if (metric.type === _metric_types.METRIC_TYPES.STD_DEVIATION && metric.mode === 'band') {
      (await (0, _helpers.getSplits)(resp, panel, series, meta, extractFields)).forEach(({
        id,
        color,
        label,
        timeseries
      }) => {
        const data = timeseries.buckets.map(bucket => [bucket.key, (0, _helpers.getAggValue)(bucket, { ...metric,
          mode: 'upper'
        }), (0, _helpers.getAggValue)(bucket, { ...metric,
          mode: 'lower'
        })]);
        results.push({
          id,
          label,
          color,
          data,
          lines: {
            show: series.chart_type === 'line',
            fill: 0.5,
            lineWidth: 0,
            mode: 'band'
          },
          bars: {
            show: series.chart_type === 'bar',
            fill: 0.5,
            mode: 'band'
          },
          points: {
            show: false
          }
        });
      });
    }

    return next(results);
  };
}