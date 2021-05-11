"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toMS = toMS;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// map of moment's short/long unit ids and elasticsearch's long unit ids
// to their value in milliseconds
const unitMappings = [['ms', 'milliseconds', 'millisecond'], ['s', 'seconds', 'second', 'sec'], ['m', 'minutes', 'minute', 'min'], ['h', 'hours', 'hour'], ['d', 'days', 'day'], ['w', 'weeks', 'week'], ['M', 'months', 'month'], ['quarter'], ['y', 'years', 'year']];
const vals = {};
unitMappings.forEach(units => {
  const normal = _moment.default.normalizeUnits(units[0]);

  const val = _moment.default.duration(1, normal).asMilliseconds();

  [].concat(normal, units).forEach(unit => {
    vals[unit] = val;
  });
}); // match any key from the vals object preceded by an optional number

const parseRE = new RegExp('^(\\d+(?:\\.\\d*)?)?\\s*(' + (0, _lodash.keys)(vals).join('|') + ')$');

function toMS(expr) {
  const match = expr.match(parseRE);

  if (match) {
    if (match[2] === 'M' && match[1] !== '1') {
      throw new Error('Invalid interval. 1M is only valid monthly interval.');
    }

    return parseFloat(match[1] || '1') * vals[match[2]];
  }
}