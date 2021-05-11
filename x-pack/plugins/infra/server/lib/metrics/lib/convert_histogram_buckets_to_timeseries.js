"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertHistogramBucketsToTimeseries = void 0;

var _lodash = require("lodash");

var rt = _interopRequireWildcard(require("io-ts"));

var _types = require("../types");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BASE_COLUMNS = [{
  name: 'timestamp',
  type: 'date'
}];
const ValueObjectTypeRT = rt.union([rt.string, rt.number, _types.MetricValueTypeRT]);

const getValue = valueObject => {
  if (_types.NormalizedMetricValueRT.is(valueObject)) {
    return valueObject.normalized_value || valueObject.value;
  }

  if (_types.PercentilesTypeRT.is(valueObject)) {
    const percentileValues = (0, _lodash.values)(valueObject.values);

    if (percentileValues.length > 1) {
      throw new Error('Metrics API only supports a single percentile, multiple percentiles should be sent separately');
    }

    return (0, _lodash.first)(percentileValues) || null;
  }

  if (_types.PercentilesKeyedTypeRT.is(valueObject)) {
    if (valueObject.values.length > 1) {
      throw new Error('Metrics API only supports a single percentile, multiple percentiles should be sent separately');
    }

    const percentileValue = (0, _lodash.first)(valueObject.values);
    return percentileValue && percentileValue.value || null;
  }

  if (_types.BasicMetricValueRT.is(valueObject)) {
    return valueObject.value;
  }

  if (_types.TopHitsTypeRT.is(valueObject)) {
    return valueObject.hits.hits.map(hit => hit._source);
  }

  return null;
};

const convertBucketsToRows = (options, buckets) => {
  return buckets.map(bucket => {
    const ids = options.metrics.map(metric => metric.id);
    const metrics = ids.reduce((acc, id) => {
      const valueObject = (0, _lodash.get)(bucket, [id]);
      return { ...acc,
        [id]: ValueObjectTypeRT.is(valueObject) ? getValue(valueObject) : null
      };
    }, {});
    return {
      timestamp: bucket.key,
      ...metrics
    };
  });
};

const convertHistogramBucketsToTimeseries = (keys, options, buckets) => {
  const id = keys.join(':'); // If there are no metrics then we just return the empty series
  // but still maintain the groupings.

  if (options.metrics.length === 0) {
    return {
      id,
      keys,
      columns: [],
      rows: []
    };
  }

  const columns = options.metrics.map(metric => ({
    name: metric.id,
    type: 'number'
  }));
  const allRows = convertBucketsToRows(options, buckets);
  const rows = options.dropLastBucket ? allRows.slice(0, allRows.length - 1) : allRows;
  return {
    id,
    keys,
    rows,
    columns: [...BASE_COLUMNS, ...columns]
  };
};

exports.convertHistogramBucketsToTimeseries = convertHistogramBucketsToTimeseries;