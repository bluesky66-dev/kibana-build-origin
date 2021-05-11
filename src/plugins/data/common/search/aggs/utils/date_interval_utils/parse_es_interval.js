"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseEsInterval = parseEsInterval;

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _invalid_es_calendar_interval_error = require("./invalid_es_calendar_interval_error");

var _invalid_es_interval_format_error = require("./invalid_es_interval_format_error");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const ES_INTERVAL_STRING_REGEX = new RegExp('^([1-9][0-9]*)\\s*(' + _datemath.default.units.join('|') + ')$');

/**
 * Extracts interval properties from an ES interval string. Disallows unrecognized interval formats
 * and fractional values. Converts some intervals from "calendar" to "fixed" when the number of
 * units is larger than 1, and throws an error for others.
 *
 * Conversion rules:
 *
 * | Interval | Single unit type | Multiple units type |
 * | -------- | ---------------- | ------------------- |
 * | ms       | fixed            | fixed               |
 * | s        | fixed            | fixed               |
 * | m        | calendar         | fixed               |
 * | h        | calendar         | fixed               |
 * | d        | calendar         | fixed               |
 * | w        | calendar         | N/A - disallowed    |
 * | M        | calendar         | N/A - disallowed    |
 * | y        | calendar         | N/A - disallowed    |
 *
 */
function parseEsInterval(interval) {
  const matches = String(interval).trim().match(ES_INTERVAL_STRING_REGEX);

  if (!matches) {
    throw new _invalid_es_interval_format_error.InvalidEsIntervalFormatError(interval);
  }

  const value = parseFloat(matches[1]);
  const unit = matches[2];
  const type = _datemath.default.unitsMap[unit].type;

  if (type === 'calendar' && value !== 1) {
    throw new _invalid_es_calendar_interval_error.InvalidEsCalendarIntervalError(interval, value, unit, type);
  }

  return {
    value,
    unit,
    type: type === 'mixed' && value === 1 || type === 'calendar' ? 'calendar' : 'fixed'
  };
}