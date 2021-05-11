"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processBucket = processBucket;

var _build_processor_function = require("../build_processor_function");

var _table = require("../response_processors/table");

var _get_last_value = require("../../../../common/get_last_value");

var _lodash = require("lodash");

var _helpers = require("../helpers");

var _get_active_series = require("../helpers/get_active_series");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function trendSinceLastBucket(data) {
  if (data.length < 2) {
    return 0;
  }

  const currentBucket = data[data.length - 1];
  const prevBucket = data[data.length - 2];
  const trend = (currentBucket[1] - prevBucket[1]) / currentBucket[1];
  return Number.isNaN(trend) ? 0 : trend;
}

function processBucket(panel, req, searchStrategy, capabilities, extractFields) {
  return async bucket => {
    const series = await Promise.all((0, _get_active_series.getActiveSeries)(panel).map(async series => {
      const timeseries = (0, _lodash.get)(bucket, `${series.id}.timeseries`);
      const buckets = (0, _lodash.get)(bucket, `${series.id}.buckets`);
      let meta = {};

      if (!timeseries && buckets) {
        meta = (0, _lodash.get)(bucket, `${series.id}.meta`);
        const timeseries = {
          buckets: (0, _lodash.get)(bucket, `${series.id}.buckets`)
        };
        (0, _helpers.overwrite)(bucket, series.id, {
          meta,
          timeseries
        });
      }

      const processor = (0, _build_processor_function.buildProcessorFunction)(_table.processors, bucket, panel, series, meta, extractFields);
      const result = (0, _lodash.first)(await processor([]));
      if (!result) return null;
      const data = (0, _lodash.get)(result, 'data', []);
      result.slope = trendSinceLastBucket(data);
      result.last = (0, _get_last_value.getLastValue)(data);
      return result;
    }));
    return {
      key: bucket.key,
      series
    };
  };
}