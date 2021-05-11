"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDuration = parseDuration;
exports.getDurationNumberInItsUnit = getDurationNumberInItsUnit;
exports.getDurationUnitValue = getDurationUnitValue;
exports.validateDurationSchema = validateDurationSchema;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SECONDS_REGEX = /^[1-9][0-9]*s$/;
const MINUTES_REGEX = /^[1-9][0-9]*m$/;
const HOURS_REGEX = /^[1-9][0-9]*h$/;
const DAYS_REGEX = /^[1-9][0-9]*d$/; // parse an interval string '{digit*}{s|m|h|d}' into milliseconds

function parseDuration(duration) {
  const parsed = parseInt(duration, 10);

  if (isSeconds(duration)) {
    return parsed * 1000;
  } else if (isMinutes(duration)) {
    return parsed * 60 * 1000;
  } else if (isHours(duration)) {
    return parsed * 60 * 60 * 1000;
  } else if (isDays(duration)) {
    return parsed * 24 * 60 * 60 * 1000;
  }

  throw new Error(`Invalid duration "${duration}". Durations must be of the form {number}x. Example: 5s, 5m, 5h or 5d"`);
}

function getDurationNumberInItsUnit(duration) {
  return parseInt(duration.replace(/[^0-9.]/g, ''), 0);
}

function getDurationUnitValue(duration) {
  const durationNumber = getDurationNumberInItsUnit(duration);
  return duration.replace(durationNumber.toString(), '');
}

function validateDurationSchema(duration) {
  if (duration.match(SECONDS_REGEX)) {
    return;
  }

  if (duration.match(MINUTES_REGEX)) {
    return;
  }

  if (duration.match(HOURS_REGEX)) {
    return;
  }

  if (duration.match(DAYS_REGEX)) {
    return;
  }

  return 'string is not a valid duration: ' + duration;
}

function isSeconds(duration) {
  return SECONDS_REGEX.test(duration);
}

function isMinutes(duration) {
  return MINUTES_REGEX.test(duration);
}

function isHours(duration) {
  return HOURS_REGEX.test(duration);
}

function isDays(duration) {
  return DAYS_REGEX.test(duration);
}