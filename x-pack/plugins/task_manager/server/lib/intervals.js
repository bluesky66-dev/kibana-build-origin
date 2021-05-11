"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInterval = isInterval;
exports.asInterval = asInterval;
exports.intervalFromNow = intervalFromNow;
exports.intervalFromDate = intervalFromDate;
exports.maxIntervalFromDate = maxIntervalFromDate;
exports.secondsFromNow = secondsFromNow;
exports.secondsFromDate = secondsFromDate;
exports.parseIntervalAsMillisecond = exports.parseIntervalAsSecond = exports.IntervalCadence = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let IntervalCadence; // Once Babel is updated ot support Typescript 4.x templated types, we can use
// this more accurate and safer compile-time valdiation
// export type Interval = `${number}${IntervalCadence}`;

exports.IntervalCadence = IntervalCadence;

(function (IntervalCadence) {
  IntervalCadence["Minute"] = "m";
  IntervalCadence["Second"] = "s";
  IntervalCadence["Hour"] = "h";
  IntervalCadence["Day"] = "d";
})(IntervalCadence || (exports.IntervalCadence = IntervalCadence = {}));

function isInterval(interval) {
  const numericAsStr = interval.slice(0, -1);
  const numeric = parseInt(numericAsStr, 10);
  const cadence = interval.slice(-1);
  return !(!isCadence(cadence) || isNaN(numeric) || numeric <= 0 || !isNumeric(numericAsStr));
}

const VALID_CADENCE = new Set(Object.values(IntervalCadence));
const CADENCE_IN_MS = {
  [IntervalCadence.Second]: 1000,
  [IntervalCadence.Minute]: 60 * 1000,
  [IntervalCadence.Hour]: 60 * 60 * 1000,
  [IntervalCadence.Day]: 24 * 60 * 60 * 1000
};

function isCadence(cadence) {
  return VALID_CADENCE.has(cadence);
}

function asInterval(ms) {
  const secondsRemainder = ms % 1000;
  const minutesRemainder = ms % 60000;
  return secondsRemainder ? `${ms}ms` : minutesRemainder ? `${ms / 1000}s` : `${ms / 60000}m`;
}
/**
 * Returns a date that is the specified interval from now. Currently,
 * only minute-intervals and second-intervals are supported.
 *
 * @param {Interval} interval - An interval of the form `Nm` such as `5m`
 */


function intervalFromNow(interval) {
  if (interval === undefined) {
    return;
  }

  return secondsFromNow(parseIntervalAsSecond(interval));
}
/**
 * Returns a date that is the specified interval from given date. Currently,
 * only minute-intervals and second-intervals are supported.
 *
 * @param {Date} date - The date to add interval to
 * @param {Interval} interval - An interval of the form `Nm` such as `5m`
 */


function intervalFromDate(date, interval) {
  if (interval === undefined) {
    return;
  }

  return secondsFromDate(date, parseIntervalAsSecond(interval));
}

function maxIntervalFromDate(date, ...intervals) {
  const maxSeconds = Math.max(...intervals.filter(_lodash.isString).map(interval => parseIntervalAsSecond(interval)));

  if (!isNaN(maxSeconds)) {
    return secondsFromDate(date, maxSeconds);
  }
}
/**
 * Returns a date that is secs seconds from now.
 *
 * @param secs The number of seconds from now
 */


function secondsFromNow(secs) {
  return secondsFromDate(new Date(), secs);
}
/**
 * Returns a date that is secs seconds from given date.
 *
 * @param date The date to add seconds to
 * @param secs The number of seconds from given date
 */


function secondsFromDate(date, secs) {
  const result = new Date(date.valueOf());
  result.setSeconds(result.getSeconds() + secs);
  return result;
}
/**
 * Verifies that the specified interval matches our expected format.
 *
 * @param {Interval} interval - An interval such as `5m` or `10s`
 * @returns {number} The interval as seconds
 */


const parseIntervalAsSecond = (0, _lodash.memoize)(interval => {
  return Math.round(parseIntervalAsMillisecond(interval) / 1000);
});
exports.parseIntervalAsSecond = parseIntervalAsSecond;
const parseIntervalAsMillisecond = (0, _lodash.memoize)(interval => {
  const numericAsStr = interval.slice(0, -1);
  const numeric = parseInt(numericAsStr, 10);
  const cadence = interval.slice(-1);

  if (!isCadence(cadence) || isNaN(numeric) || numeric <= 0 || !isNumeric(numericAsStr)) {
    throw new Error(`Invalid interval "${interval}". Intervals must be of the form {number}m. Example: 5m.`);
  }

  return numeric * CADENCE_IN_MS[cadence];
});
exports.parseIntervalAsMillisecond = parseIntervalAsMillisecond;

const isNumeric = numAsStr => /^\d+$/.test(numAsStr);