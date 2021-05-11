"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stdSibling = stdSibling;

var _get_default_decoration = require("../../helpers/get_default_decoration");

var _get_splits = require("../../helpers/get_splits");

var _get_last_metric = require("../../helpers/get_last_metric");

var _get_sibling_agg_value = require("../../helpers/get_sibling_agg_value");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function stdSibling(resp, panel, series, meta, extractFields) {
  return next => async results => {
    const metric = (0, _get_last_metric.getLastMetric)(series);
    if (!/_bucket$/.test(metric.type)) return next(results);
    if (metric.type === 'std_deviation_bucket' && metric.mode === 'band') return next(results);
    const decoration = (0, _get_default_decoration.getDefaultDecoration)(series);
    (await (0, _get_splits.getSplits)(resp, panel, series, meta, extractFields)).forEach(split => {
      const data = split.timeseries.buckets.map(bucket => {
        return [bucket.key, (0, _get_sibling_agg_value.getSiblingAggValue)(split, metric)];
      });
      results.push({
        id: split.id,
        label: split.label,
        color: split.color,
        data,
        ...decoration
      });
    });
    return next(results);
  };
}