"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimeRangeFilterClauses = exports.createSortClause = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createSortClause = (sortDirection, timestampField, tiebreakerField) => ({
  sort: {
    [timestampField]: sortDirection,
    [tiebreakerField]: sortDirection
  }
});

exports.createSortClause = createSortClause;

const createTimeRangeFilterClauses = (startTimestamp, endTimestamp, timestampField) => [{
  range: {
    [timestampField]: {
      gte: startTimestamp,
      lte: endTimestamp,
      format: 'epoch_millis'
    }
  }
}];

exports.createTimeRangeFilterClauses = createTimeRangeFilterClauses;