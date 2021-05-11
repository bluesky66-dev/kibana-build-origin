"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHistogramInterval = exports.parseRelativeDate = void 0;

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _constants = require("../../../common/constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const parseRelativeDate = (dateStr, options = {}) => {
  var _parsedDate$valueOf; // We need this this parsing because if user selects This week or this date
  // That represents end date in future, if week or day is still in the middle
  // Uptime data can never be collected in future, so we will reset date to now
  // in That case. Example case we select this week range will be to='now/w' and from = 'now/w';


  const parsedDate = _datemath.default.parse(dateStr, options);

  const dateTimestamp = (_parsedDate$valueOf = parsedDate === null || parsedDate === void 0 ? void 0 : parsedDate.valueOf()) !== null && _parsedDate$valueOf !== void 0 ? _parsedDate$valueOf : 0;

  if (dateTimestamp > Date.now()) {
    return _datemath.default.parse('now');
  }

  return parsedDate;
};

exports.parseRelativeDate = parseRelativeDate;

const getHistogramInterval = (dateRangeStart, dateRangeEnd, bucketCount) => {
  const from = parseRelativeDate(dateRangeStart); // roundUp is required for relative date like now/w to get the end of the week

  const to = parseRelativeDate(dateRangeEnd, {
    roundUp: true
  });

  if (from === undefined) {
    throw Error('Invalid dateRangeStart value');
  }

  if (to === undefined) {
    throw Error('Invalid dateRangeEnd value');
  }

  const interval = Math.round((to.valueOf() - from.valueOf()) / (bucketCount || _constants.QUERY.DEFAULT_BUCKET_COUNT)); // Interval can never be zero, if it's 0 we return at least 1ms interval

  return interval > 0 ? interval : 1;
};

exports.getHistogramInterval = getHistogramInterval;