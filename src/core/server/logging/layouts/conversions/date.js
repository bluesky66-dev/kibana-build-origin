"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateConversion = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const dateRegExp = /%date({(?<format>[^}]+)})?({(?<timezone>[^}]+)})?/g;
const formats = {
  ISO8601: 'ISO8601',
  ISO8601_TZ: 'ISO8601_TZ',
  ABSOLUTE: 'ABSOLUTE',
  UNIX: 'UNIX',
  UNIX_MILLIS: 'UNIX_MILLIS'
};

function formatDate(date, dateFormat = formats.ISO8601_TZ, timezone) {
  const momentDate = (0, _momentTimezone.default)(date);
  momentDate.tz(timezone !== null && timezone !== void 0 ? timezone : _momentTimezone.default.tz.guess());

  switch (dateFormat) {
    case formats.ISO8601:
      return momentDate.toISOString();

    case formats.ISO8601_TZ:
      return momentDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    case formats.ABSOLUTE:
      return momentDate.format('HH:mm:ss.SSS');

    case formats.UNIX:
      return momentDate.format('X');

    case formats.UNIX_MILLIS:
      return momentDate.format('x');

    default:
      throw new Error(`Unknown format: ${dateFormat}`);
  }
}

function validateDateFormat(input) {
  if (!Reflect.has(formats, input)) {
    throw new Error(`Date format expected one of ${Reflect.ownKeys(formats).join(', ')}, but given: ${input}`);
  }
}

function validateTimezone(timezone) {
  if (_momentTimezone.default.tz.zone(timezone)) return;
  throw new Error(`Unknown timezone: ${timezone}`);
}

function validate(rawString) {
  for (const matched of rawString.matchAll(dateRegExp)) {
    const {
      format,
      timezone
    } = matched.groups;

    if (format) {
      validateDateFormat(format);
    }

    if (timezone) {
      validateTimezone(timezone);
    }
  }
}

const DateConversion = {
  pattern: dateRegExp,

  convert(record, highlight, ...matched) {
    const groups = (0, _lodash.last)(matched);
    const {
      format,
      timezone
    } = groups;
    return formatDate(record.timestamp, format, timezone);
  },

  validate
};
exports.DateConversion = DateConversion;