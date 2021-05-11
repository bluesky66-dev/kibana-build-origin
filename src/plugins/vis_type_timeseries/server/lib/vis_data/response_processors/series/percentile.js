"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.percentile = percentile;

var _get_agg_value = require("../../helpers/get_agg_value");

var _get_default_decoration = require("../../helpers/get_default_decoration");

var _get_splits = require("../../helpers/get_splits");

var _get_last_metric = require("../../helpers/get_last_metric");

var _metric_types = require("../../../../../common/metric_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function percentile(resp, panel, series, meta, extractFields) {
  return next => async results => {
    const metric = (0, _get_last_metric.getLastMetric)(series);

    if (metric.type !== _metric_types.METRIC_TYPES.PERCENTILE) {
      return next(results);
    }

    (await (0, _get_splits.getSplits)(resp, panel, series, meta, extractFields)).forEach(split => {
      metric.percentiles.forEach(percentile => {
        const percentileValue = percentile.value ? percentile.value : 0;
        const id = `${split.id}:${percentile.id}`;
        const data = split.timeseries.buckets.map(bucket => {
          const higherMetric = { ...metric,
            percent: percentileValue
          };
          const serieData = [bucket.key, (0, _get_agg_value.getAggValue)(bucket, higherMetric)];

          if (percentile.mode === 'band') {
            const lowerMetric = { ...metric,
              percent: percentile.percentile
            };
            serieData.push((0, _get_agg_value.getAggValue)(bucket, lowerMetric));
          }

          return serieData;
        });

        if (percentile.mode === 'band') {
          results.push({
            id,
            color: split.color,
            label: split.label,
            data,
            lines: {
              show: series.chart_type === 'line',
              fill: Number(percentile.shade),
              lineWidth: 0,
              mode: 'band'
            },
            bars: {
              show: series.chart_type === 'bar',
              fill: Number(percentile.shade),
              mode: 'band'
            },
            points: {
              show: false
            },
            y1AccessorFormat: ` (${percentileValue})`,
            y0AccessorFormat: ` (${percentile.percentile})`
          });
        } else {
          const decoration = (0, _get_default_decoration.getDefaultDecoration)(series);
          results.push({
            id,
            color: split.color,
            label: `${split.label} (${percentileValue})`,
            data,
            ...decoration
          });
        }
      });
    });
    return next(results);
  };
}