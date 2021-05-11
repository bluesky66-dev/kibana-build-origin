"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatHumanReadableDate = formatHumanReadableDate;
exports.formatHumanReadableDateTime = formatHumanReadableDateTime;
exports.formatHumanReadableDateTimeSeconds = formatHumanReadableDateTimeSeconds;
exports.validateTimeRange = validateTimeRange;
exports.timeFormatter = void 0;

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _eui = require("@elastic/eui");

var _time_format = require("../constants/time_format");

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
// utility functions for handling dates


function formatHumanReadableDate(ts) {
  return (0, _eui.formatDate)(ts, 'MMMM Do YYYY');
}

function formatHumanReadableDateTime(ts) {
  return (0, _eui.formatDate)(ts, 'MMMM Do YYYY, HH:mm');
}

function formatHumanReadableDateTimeSeconds(ts) {
  return (0, _eui.formatDate)(ts, 'MMMM Do YYYY, HH:mm:ss');
}

function validateTimeRange(time) {
  if (!time) return false;

  const momentDateFrom = _datemath.default.parse(time.from);

  const momentDateTo = _datemath.default.parse(time.to);

  return !!(momentDateFrom && momentDateFrom.isValid() && momentDateTo && momentDateTo.isValid());
}

const timeFormatter = value => {
  return (0, _eui.formatDate)(value, _time_format.TIME_FORMAT);
};

exports.timeFormatter = timeFormatter;