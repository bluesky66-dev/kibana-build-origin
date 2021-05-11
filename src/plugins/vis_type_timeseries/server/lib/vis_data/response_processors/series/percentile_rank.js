"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.percentileRank = percentileRank;

var _get_agg_value = require("../../helpers/get_agg_value");

var _get_default_decoration = require("../../helpers/get_default_decoration");

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
function percentileRank(resp, panel, series, meta, extractFields) {
  return next => async results => {
    const metric = (0, _get_last_metric.getLastMetric)(series);

    if (metric.type !== _metric_types.METRIC_TYPES.PERCENTILE_RANK) {
      return next(results);
    }

    (await (0, _get_splits.getSplits)(resp, panel, series, meta, extractFields)).forEach(split => {
      (metric.values || []).forEach((percentileRank, index) => {
        const data = split.timeseries.buckets.map(bucket => [bucket.key, (0, _get_agg_value.getAggValue)(bucket, { ...metric,
          value: (0, _to_percentile_number.toPercentileNumber)(percentileRank)
        })]);
        results.push({
          data,
          id: `${split.id}:${percentileRank}:${index}`,
          label: `${split.label} (${percentileRank || 0})`,
          color: split.color,
          ...(0, _get_default_decoration.getDefaultDecoration)(series)
        });
      });
    });
    return next(results);
  };
}