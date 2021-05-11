"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateBounds = calculateBounds;
exports.getAbsoluteTimeRange = getAbsoluteTimeRange;
exports.getTime = getTime;

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _ = require("../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function calculateBounds(timeRange, options = {}) {
  return {
    min: _datemath.default.parse(timeRange.from, {
      forceNow: options.forceNow
    }),
    max: _datemath.default.parse(timeRange.to, {
      roundUp: true,
      forceNow: options.forceNow
    })
  };
}

function getAbsoluteTimeRange(timeRange, {
  forceNow
} = {}) {
  const {
    min,
    max
  } = calculateBounds(timeRange, {
    forceNow
  });
  return {
    from: min ? min.toISOString() : timeRange.from,
    to: max ? max.toISOString() : timeRange.to
  };
}

function getTime(indexPattern, timeRange, options) {
  return createTimeRangeFilter(indexPattern, timeRange, (options === null || options === void 0 ? void 0 : options.fieldName) || (indexPattern === null || indexPattern === void 0 ? void 0 : indexPattern.timeFieldName), options === null || options === void 0 ? void 0 : options.forceNow);
}

function createTimeRangeFilter(indexPattern, timeRange, fieldName, forceNow) {
  if (!indexPattern) {
    return;
  }

  const field = indexPattern.fields.find(f => f.name === (fieldName || indexPattern.timeFieldName));

  if (!field) {
    return;
  }

  const bounds = calculateBounds(timeRange, {
    forceNow
  });

  if (!bounds) {
    return;
  }

  return (0, _.buildRangeFilter)(field, { ...(bounds.min && {
      gte: bounds.min.toISOString()
    }),
    ...(bounds.max && {
      lte: bounds.max.toISOString()
    }),
    format: 'strict_date_optional_time'
  }, indexPattern);
}