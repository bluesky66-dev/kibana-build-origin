"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDateTimeLocal = formatDateTimeLocal;
exports.shortenPipelineHash = shortenPipelineHash;
exports.getDateFromNow = getDateFromNow;
exports.getCalendar = getCalendar;
exports.ROUNDED_FLOAT = exports.LARGE_ABBREVIATED = exports.SMALL_BYTES = exports.LARGE_BYTES = exports.SMALL_FLOAT = exports.LARGE_FLOAT = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

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


const LARGE_FLOAT = '0,0.[00]';
exports.LARGE_FLOAT = LARGE_FLOAT;
const SMALL_FLOAT = '0.[00]';
exports.SMALL_FLOAT = SMALL_FLOAT;
const LARGE_BYTES = '0,0.0 b';
exports.LARGE_BYTES = LARGE_BYTES;
const SMALL_BYTES = '0.0 b';
exports.SMALL_BYTES = SMALL_BYTES;
const LARGE_ABBREVIATED = '0,0.[0]a';
exports.LARGE_ABBREVIATED = LARGE_ABBREVIATED;
const ROUNDED_FLOAT = '00.[00]';
/**
 * Format the {@code date} in the user's expected date/time format using their <em>guessed</em> local time zone.
 * @param date Either a numeric Unix timestamp or a {@code Date} object
 * @returns The date formatted using 'LL LTS'
 */

exports.ROUNDED_FLOAT = ROUNDED_FLOAT;

function formatDateTimeLocal(date, useUTC = false, timezone = null) {
  return useUTC ? _momentTimezone.default.utc(date).format('LL LTS') : _momentTimezone.default.tz(date, timezone || _momentTimezone.default.tz.guess()).format('LL LTS');
}
/**
 * Shorten a Logstash Pipeline's hash for display purposes
 * @param {string} hash The complete hash
 * @return {string} The shortened hash
 */


function shortenPipelineHash(hash) {
  return hash.substr(0, 6);
}

function getDateFromNow(timestamp, tz) {
  return (0, _momentTimezone.default)(timestamp).tz(tz === 'Browser' ? _momentTimezone.default.tz.guess() : tz).fromNow();
}

function getCalendar(timestamp, tz) {
  return (0, _momentTimezone.default)(timestamp).tz(tz === 'Browser' ? _momentTimezone.default.tz.guess() : tz).calendar();
}