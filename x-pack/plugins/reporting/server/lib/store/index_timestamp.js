"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexTimestamp = indexTimestamp;
exports.intervals = void 0;

var _moment = _interopRequireDefault(require("moment"));

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


const intervals = ['year', 'month', 'week', 'day', 'hour', 'minute'];
exports.intervals = intervals;

function indexTimestamp(intervalStr, separator = '-') {
  const startOf = intervalStr;
  if (separator.match(/[a-z]/i)) throw new Error('Interval separator can not be a letter');
  const index = intervals.indexOf(intervalStr);
  if (index === -1) throw new Error('Invalid index interval: ' + intervalStr);
  const m = (0, _moment.default)();
  m.startOf(startOf);
  let dateString;

  switch (intervalStr) {
    case 'year':
      dateString = 'YYYY';
      break;

    case 'month':
      dateString = `YYYY${separator}MM`;
      break;

    case 'hour':
      dateString = `YYYY${separator}MM${separator}DD${separator}HH`;
      break;

    case 'minute':
      dateString = `YYYY${separator}MM${separator}DD${separator}HH${separator}mm`;
      break;

    default:
      dateString = `YYYY${separator}MM${separator}DD`;
  }

  return m.format(dateString);
}