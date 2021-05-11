"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateDateHistogramOffset = void 0;

var _calculate_bucket_size = require("./calculate_bucket_size");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const calculateDateHistogramOffset = timerange => {
  const fromInSeconds = Math.floor(timerange.from / 1000);
  const {
    bucketSize
  } = (0, _calculate_bucket_size.calculateBucketSize)(timerange); // negative offset to align buckets with full intervals (e.g. minutes)

  const offset = fromInSeconds % bucketSize - bucketSize;
  return `${offset}s`;
};

exports.calculateDateHistogramOffset = calculateDateHistogramOffset;