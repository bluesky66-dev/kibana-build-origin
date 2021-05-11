"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThroughputBuckets = getThroughputBuckets;

var _lodash = require("lodash");

var _i18n = require("../../../../common/i18n");

var _calculate_throughput = require("../../helpers/calculate_throughput");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getThroughputBuckets({
  throughputResultBuckets = [],
  bucketSize,
  setupTimeRange
}) {
  const {
    start,
    end
  } = setupTimeRange;
  const buckets = throughputResultBuckets.map(({
    key: resultKey,
    timeseries
  }) => {
    const dataPoints = timeseries.buckets.map(bucket => {
      return {
        x: bucket.key,
        // divide by minutes
        y: bucket.doc_count / (bucketSize / 60)
      };
    }); // Handle empty string result keys

    const key = resultKey === '' ? _i18n.NOT_AVAILABLE_LABEL : resultKey;
    const docCountTotal = timeseries.buckets.map(bucket => bucket.doc_count).reduce((a, b) => a + b, 0); // calculate average throughput

    const avg = (0, _calculate_throughput.calculateThroughput)({
      start,
      end,
      value: docCountTotal
    });
    return {
      key,
      dataPoints,
      avg
    };
  });
  return (0, _lodash.sortBy)(buckets, bucket => bucket.key.toString().replace(/^HTTP (\d)xx$/, '00$1') // ensure that HTTP 3xx are sorted at the top
  );
}