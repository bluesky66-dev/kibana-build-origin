"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAggregations = getAggregations;
exports.getAggregationBucketsName = exports.getDatafeedAggregations = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getAggregations(obj) {
  if ((obj === null || obj === void 0 ? void 0 : obj.aggregations) !== undefined) return obj.aggregations;
  if ((obj === null || obj === void 0 ? void 0 : obj.aggs) !== undefined) return obj.aggs;
  return undefined;
}

const getDatafeedAggregations = datafeedConfig => {
  return getAggregations(datafeedConfig);
};

exports.getDatafeedAggregations = getDatafeedAggregations;

const getAggregationBucketsName = aggregations => {
  if (aggregations !== null && typeof aggregations === 'object') {
    const keys = Object.keys(aggregations);
    return keys.length > 0 ? keys[0] : undefined;
  }
};

exports.getAggregationBucketsName = getAggregationBucketsName;