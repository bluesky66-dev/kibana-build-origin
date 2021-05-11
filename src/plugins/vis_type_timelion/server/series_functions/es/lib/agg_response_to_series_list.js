"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeBucketsToPairs = timeBucketsToPairs;
exports.flattenBucket = flattenBucket;
exports.default = toSeriesList;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function timeBucketsToPairs(buckets) {
  const timestamps = _lodash.default.map(buckets, 'key');

  const series = {};

  _lodash.default.each(buckets, function (bucket) {
    _lodash.default.forOwn(bucket, function (val, key) {
      if (_lodash.default.isPlainObject(val)) {
        if (val.values) {
          _lodash.default.forOwn(val.values, function (bucketValue, bucketKey) {
            const k = key + ':' + bucketKey;
            const v = isNaN(bucketValue) ? NaN : bucketValue;
            series[k] = series[k] || [];
            series[k].push(v);
          });
        } else {
          series[key] = series[key] || [];
          series[key].push(val.value);
        }
      }
    });
  });

  return _lodash.default.mapValues(series, function (values) {
    return _lodash.default.zip(timestamps, values);
  });
}

function flattenBucket(bucket, splitKey, path, result) {
  result = result || {};
  path = path || [];

  _lodash.default.forOwn(bucket, function (val, key) {
    if (!_lodash.default.isPlainObject(val)) return;

    if (_lodash.default.get(val, 'meta.type') === 'split') {
      _lodash.default.each(val.buckets, function (bucket, bucketKey) {
        if (bucket.key == null) bucket.key = bucketKey; // For handling "keyed" response formats, e.g., filters agg

        flattenBucket(bucket, bucket.key, path.concat([key + ':' + bucket.key]), result);
      });
    } else if (_lodash.default.get(val, 'meta.type') === 'time_buckets') {
      const metrics = timeBucketsToPairs(val.buckets);

      _lodash.default.each(metrics, function (pairs, metricName) {
        result[path.concat([metricName]).join(' > ')] = {
          data: pairs,
          splitKey: splitKey
        };
      });
    }
  });

  return result;
}

function toSeriesList(aggs, config) {
  return _lodash.default.map(flattenBucket(aggs), function (metrics, name) {
    return {
      data: metrics.data,
      type: 'series',
      fit: config.fit,
      label: name,
      split: metrics.splitKey
    };
  });
}