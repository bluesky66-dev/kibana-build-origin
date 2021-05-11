"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidTimeField = isValidTimeField;
exports.validateTimeRange = validateTimeRange;

var _server = require("../../../../../../src/plugins/data/server");

var _parse_interval = require("../../../common/util/parse_interval");

var _validate_job_object = require("./validate_job_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BUCKET_SPAN_COMPARE_FACTOR = 25;
const MIN_TIME_SPAN_MS = 7200000;
const MIN_TIME_SPAN_READABLE = '2 hours';

async function isValidTimeField({
  asCurrentUser
}, job) {
  var _fieldCaps$fields$tim, _fieldCaps$fields$tim2;

  const index = job.datafeed_config.indices.join(',');
  const timeField = job.data_description.time_field; // check if time_field is of type 'date' or 'date_nanos'

  const {
    body: fieldCaps
  } = await asCurrentUser.fieldCaps({
    index,
    fields: [timeField]
  });
  let fieldType = fieldCaps === null || fieldCaps === void 0 ? void 0 : (_fieldCaps$fields$tim = fieldCaps.fields[timeField]) === null || _fieldCaps$fields$tim === void 0 ? void 0 : (_fieldCaps$fields$tim2 = _fieldCaps$fields$tim.date) === null || _fieldCaps$fields$tim2 === void 0 ? void 0 : _fieldCaps$fields$tim2.type;

  if (fieldType === undefined) {
    var _fieldCaps$fields$tim3, _fieldCaps$fields$tim4;

    fieldType = fieldCaps === null || fieldCaps === void 0 ? void 0 : (_fieldCaps$fields$tim3 = fieldCaps.fields[timeField]) === null || _fieldCaps$fields$tim3 === void 0 ? void 0 : (_fieldCaps$fields$tim4 = _fieldCaps$fields$tim3.date_nanos) === null || _fieldCaps$fields$tim4 === void 0 ? void 0 : _fieldCaps$fields$tim4.type;
  }

  return fieldType === _server.ES_FIELD_TYPES.DATE || fieldType === _server.ES_FIELD_TYPES.DATE_NANOS;
}

async function validateTimeRange(mlClientCluster, job, timeRange) {
  const messages = [];
  (0, _validate_job_object.validateJobObject)(job); // check if time_field is a date type

  if (!(await isValidTimeField(mlClientCluster, job))) {
    messages.push({
      id: 'time_field_invalid',
      timeField: job.data_description.time_field
    }); // if the time field is invalid, skip all other checks

    return messages;
  } // if there is no duration, do not run the estimate test


  if (typeof timeRange === 'undefined' || typeof timeRange.start === 'undefined' || typeof timeRange.end === 'undefined') {
    return messages;
  } // check if time range is after the Unix epoch start


  if (timeRange.start < 0 || timeRange.end < 0) {
    messages.push({
      id: 'time_range_before_epoch'
    });
  } // check for minimum time range (25 buckets or 2 hours, whichever is longer)


  const interval = (0, _parse_interval.parseInterval)(job.analysis_config.bucket_span, true);

  if (interval === null) {
    messages.push({
      id: 'bucket_span_invalid'
    });
  } else {
    const bucketSpan = interval.asMilliseconds();
    const minTimeSpanBasedOnBucketSpan = bucketSpan * BUCKET_SPAN_COMPARE_FACTOR;
    const timeSpan = timeRange.end - timeRange.start;
    const minRequiredTimeSpan = Math.max(MIN_TIME_SPAN_MS, minTimeSpanBasedOnBucketSpan);

    if (minRequiredTimeSpan > timeSpan) {
      messages.push({
        id: 'time_range_short',
        minTimeSpanReadable: MIN_TIME_SPAN_READABLE,
        bucketSpanCompareFactor: BUCKET_SPAN_COMPARE_FACTOR
      });
    }
  }

  if (messages.length === 0) {
    messages.push({
      id: 'success_time_range'
    });
  }

  return messages;
}