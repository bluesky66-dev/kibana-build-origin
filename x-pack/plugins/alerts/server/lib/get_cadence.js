"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timePeriodBeforeDate = timePeriodBeforeDate;
exports.parseIntervalAsMillisecond = exports.TimeUnit = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let TimeUnit;
exports.TimeUnit = TimeUnit;

(function (TimeUnit) {
  TimeUnit["Minute"] = "m";
  TimeUnit["Second"] = "s";
  TimeUnit["Hour"] = "h";
  TimeUnit["Day"] = "d";
})(TimeUnit || (exports.TimeUnit = TimeUnit = {}));

const VALID_CADENCE = new Set(Object.values(TimeUnit));
const CADENCE_IN_MS = {
  [TimeUnit.Second]: 1000,
  [TimeUnit.Minute]: 60 * 1000,
  [TimeUnit.Hour]: 60 * 60 * 1000,
  [TimeUnit.Day]: 24 * 60 * 60 * 1000
};

const isNumeric = numAsStr => /^\d+$/.test(numAsStr);

const parseIntervalAsMillisecond = (0, _lodash.memoize)(value => {
  const numericAsStr = value.slice(0, -1);
  const numeric = parseInt(numericAsStr, 10);
  const cadence = value.slice(-1);

  if (!VALID_CADENCE.has(cadence) || isNaN(numeric) || numeric <= 0 || !isNumeric(numericAsStr)) {
    throw new Error(`Invalid time value "${value}". Time must be of the form {number}m. Example: 5m.`);
  }

  return numeric * CADENCE_IN_MS[cadence];
});
/**
 * Returns a date that is the specified interval from given date.
 *
 * @param {Date} date - The date to add interval to
 * @param {string} interval - THe time of the form `Nm` such as `5m`
 */

exports.parseIntervalAsMillisecond = parseIntervalAsMillisecond;

function timePeriodBeforeDate(date, timePeriod) {
  const result = new Date(date.valueOf());
  const milisecFromTime = parseIntervalAsMillisecond(timePeriod);
  result.setMilliseconds(result.getMilliseconds() - milisecFromTime);
  return result;
}