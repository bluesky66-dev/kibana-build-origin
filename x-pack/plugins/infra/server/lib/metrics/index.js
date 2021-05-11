"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _ThrowReporter = require("io-ts/lib/ThrowReporter");

var _http_api = require("../../../common/http_api");

var _types = require("./types");

var _constants = require("./constants");

var _create_aggregations = require("./lib/create_aggregations");

var _convert_histogram_buckets_to_timeseries = require("./lib/convert_histogram_buckets_to_timeseries");

var _calculate_bucket_size = require("./lib/calculate_bucket_size");

var _calculate_interval = require("./lib/calculate_interval");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const query = async (search, rawOptions) => {
  var _options$groupBy$map, _options$groupBy;

  const interval = await (0, _calculate_interval.calculatedInterval)(search, rawOptions);
  const options = { ...rawOptions,
    timerange: { ...rawOptions.timerange,
      interval
    }
  };
  const hasGroupBy = Array.isArray(options.groupBy) && options.groupBy.length > 0;
  const filter = [{
    range: {
      [options.timerange.field]: {
        gte: options.timerange.from,
        lte: options.timerange.to,
        format: 'epoch_millis'
      }
    }
  }, ...((_options$groupBy$map = (_options$groupBy = options.groupBy) === null || _options$groupBy === void 0 ? void 0 : _options$groupBy.map(field => ({
    exists: {
      field
    }
  }))) !== null && _options$groupBy$map !== void 0 ? _options$groupBy$map : [])];
  const params = {
    allowNoIndices: true,
    ignoreUnavailable: true,
    index: options.indexPattern,
    body: {
      size: 0,
      query: {
        bool: {
          filter
        }
      },
      aggs: { ...(0, _create_aggregations.createAggregations)(options)
      }
    }
  };

  if (hasGroupBy) {
    if (options.afterKey) {
      if (_http_api.afterKeyObjectRT.is(options.afterKey)) {
        (0, _saferLodashSet.set)(params, 'body.aggs.groupings.composite.after', options.afterKey);
      } else {
        (0, _saferLodashSet.set)(params, 'body.aggs.groupings.composite.after', {
          groupBy0: options.afterKey
        });
      }
    }
  }

  if (options.filters) {
    params.body.query.bool.filter = [...params.body.query.bool.filter, ...options.filters];
  }

  const response = await search(params);

  if (response.hits.total.value === 0) {
    return _constants.EMPTY_RESPONSE;
  }

  if (!response.aggregations) {
    throw new Error('Aggregations should be present.');
  }

  const {
    bucketSize
  } = (0, _calculate_bucket_size.calculateBucketSize)({ ...options.timerange,
    interval
  });

  if (hasGroupBy && _types.GroupingResponseRT.is(response.aggregations)) {
    const {
      groupings
    } = response.aggregations;
    const {
      after_key: afterKey
    } = groupings;
    const limit = options.limit || 9;
    const returnAfterKey = afterKey && groupings.buckets.length === limit ? true : false;
    return {
      series: groupings.buckets.map(bucket => {
        const keys = Object.values(bucket.key);
        return (0, _convert_histogram_buckets_to_timeseries.convertHistogramBucketsToTimeseries)(keys, options, bucket.histogram.buckets);
      }),
      info: {
        afterKey: returnAfterKey ? afterKey : null,
        interval: bucketSize
      }
    };
  } else if (hasGroupBy) {
    _ThrowReporter.ThrowReporter.report(_types.GroupingResponseRT.decode(response.aggregations));
  }

  if (_types.HistogramResponseRT.is(response.aggregations)) {
    return {
      series: [(0, _convert_histogram_buckets_to_timeseries.convertHistogramBucketsToTimeseries)(['*'], options, response.aggregations.histogram.buckets)],
      info: {
        afterKey: null,
        interval: bucketSize
      }
    };
  } else {
    _ThrowReporter.ThrowReporter.report(_types.HistogramResponseRT.decode(response.aggregations));
  }

  throw new Error('Elasticsearch responsed with an unrecoginzed format.');
};

exports.query = query;