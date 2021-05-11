"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatUTCTimestampForTimezone = void 0;

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

/**
 * This function is designed to offset a UTC timestamp based on the provided timezone
 * For example, EST is UTC-4h so this function will subtract (4 * 60 * 60 * 1000)ms
 * from the UTC timestamp. This allows us to allow users to view monitoring data
 * in various timezones without needing to not store UTC dates.
 *
 * @param {*} utcTimestamp UTC timestamp
 * @param {*} timezone The timezone to convert into
 */


const formatUTCTimestampForTimezone = (utcTimestamp, timezone) => {
  if (timezone === 'Browser') {
    return utcTimestamp;
  }

  const offsetInMinutes = _moment.default.tz(timezone).utcOffset();

  const offsetTimestamp = utcTimestamp + offsetInMinutes * 1 * 60 * 1000;
  return offsetTimestamp;
};

exports.formatUTCTimestampForTimezone = formatUTCTimestampForTimezone;