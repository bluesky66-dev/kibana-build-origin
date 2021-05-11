"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateRangeInfo = getDateRangeInfo;
exports.getTooManyIntervalsErrorMessage = getTooManyIntervalsErrorMessage;
exports.getDateStartAfterDateEndErrorMessage = getDateStartAfterDateEndErrorMessage;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _server = require("../../../../alerts/server");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Given a start and end date, an interval, and a window, calculate the
// array of date ranges, each date range is offset by it's peer by one interval,
// and each date range is window milliseconds long.


function getDateRangeInfo(params) {
  const {
    dateStart: dateStartS,
    dateEnd: dateEndS,
    interval: intervalS,
    window: windowS
  } = params; // get dates in epoch millis, interval and window in millis

  const dateEnd = getDateOrUndefined(dateEndS, 'dateEnd') || Date.now();
  const dateStart = getDateOrUndefined(dateStartS, 'dateStart') || dateEnd;
  if (dateStart > dateEnd) throw new Error(getDateStartAfterDateEndErrorMessage());
  const interval = getDurationOrUndefined(intervalS, 'interval') || 0;
  const window = getDuration(windowS, 'window'); // Start from the end, as it's more likely the user wants precision there.
  // We'll reverse the resultant ranges at the end, to get ascending order.

  let dateCurrent = dateEnd;
  const dateRanges = []; // Calculate number of intervals; if no interval specified, only calculate one.

  const intervals = !interval ? 1 : 1 + Math.round((dateEnd - dateStart) / interval);

  if (intervals > _index.MAX_INTERVALS) {
    throw new Error(getTooManyIntervalsErrorMessage(intervals, _index.MAX_INTERVALS));
  }

  (0, _lodash.times)(intervals, () => {
    dateRanges.push({
      from: new Date(dateCurrent - window).toISOString(),
      to: new Date(dateCurrent).toISOString()
    });
    dateCurrent -= interval;
  }); // reverse in-place

  dateRanges.reverse();
  return {
    dateStart: dateRanges[0].from,
    dateEnd: dateRanges[dateRanges.length - 1].to,
    dateRanges
  };
}

function getDateOrUndefined(dateS, field) {
  if (!dateS) return undefined;
  return getDate(dateS, field);
}

function getDate(dateS, field) {
  const date = Date.parse(dateS);
  if (isNaN(date)) throw new Error(getParseErrorMessage('date', field, dateS));
  return date.valueOf();
}

function getDurationOrUndefined(durationS, field) {
  if (!durationS) return undefined;
  return getDuration(durationS, field);
}

function getDuration(durationS, field) {
  try {
    return (0, _server.parseDuration)(durationS);
  } catch (err) {
    throw new Error(getParseErrorMessage('duration', field, durationS));
  }
}

function getParseErrorMessage(formatName, fieldName, fieldValue) {
  return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.formattedFieldErrorMessage', {
    defaultMessage: 'invalid {formatName} format for {fieldName}: "{fieldValue}"',
    values: {
      formatName,
      fieldName,
      fieldValue
    }
  });
}

function getTooManyIntervalsErrorMessage(intervals, maxIntervals) {
  return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.maxIntervalsErrorMessage', {
    defaultMessage: 'calculated number of intervals {intervals} is greater than maximum {maxIntervals}',
    values: {
      intervals,
      maxIntervals
    }
  });
}

function getDateStartAfterDateEndErrorMessage() {
  return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.dateStartGTdateEndErrorMessage', {
    defaultMessage: '[dateStart]: is greater than [dateEnd]'
  });
}