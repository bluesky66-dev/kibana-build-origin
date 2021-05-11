"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllMetricsData = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAllMetricsData = async (query, options, previousBuckets = []) => {
  const response = await query(options); // Nothing available, return the previous buckets.

  if (response.series.length === 0) {
    return previousBuckets;
  }

  const currentBuckets = response.series; // if there are no currentBuckets then we are finished paginating through the results

  if (!response.info.afterKey) {
    return previousBuckets.concat(currentBuckets);
  } // There is possibly more data, concat previous and current buckets and call ourselves recursively.


  const newOptions = { ...options,
    afterKey: response.info.afterKey
  };
  return getAllMetricsData(query, newOptions, previousBuckets.concat(currentBuckets));
};

exports.getAllMetricsData = getAllMetricsData;