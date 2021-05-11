"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PARTITION_FIELD_VALUE = exports.JOB_ID = exports.PARTITION_FIELDS = exports.ANOMALY_RESULT_TYPE = exports.SEVERITY_COLORS = exports.ANOMALY_THRESHOLD = exports.ANOMALY_SEVERITY = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let ANOMALY_SEVERITY;
exports.ANOMALY_SEVERITY = ANOMALY_SEVERITY;

(function (ANOMALY_SEVERITY) {
  ANOMALY_SEVERITY["CRITICAL"] = "critical";
  ANOMALY_SEVERITY["MAJOR"] = "major";
  ANOMALY_SEVERITY["MINOR"] = "minor";
  ANOMALY_SEVERITY["WARNING"] = "warning";
  ANOMALY_SEVERITY["LOW"] = "low";
  ANOMALY_SEVERITY["UNKNOWN"] = "unknown";
})(ANOMALY_SEVERITY || (exports.ANOMALY_SEVERITY = ANOMALY_SEVERITY = {}));

let ANOMALY_THRESHOLD;
exports.ANOMALY_THRESHOLD = ANOMALY_THRESHOLD;

(function (ANOMALY_THRESHOLD) {
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["CRITICAL"] = 75] = "CRITICAL";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["MAJOR"] = 50] = "MAJOR";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["MINOR"] = 25] = "MINOR";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["WARNING"] = 3] = "WARNING";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["LOW"] = 0] = "LOW";
})(ANOMALY_THRESHOLD || (exports.ANOMALY_THRESHOLD = ANOMALY_THRESHOLD = {}));

const SEVERITY_COLORS = {
  CRITICAL: '#fe5050',
  MAJOR: '#fba740',
  MINOR: '#fdec25',
  WARNING: '#8bc8fb',
  LOW: '#d2e9f7',
  BLANK: '#ffffff'
};
exports.SEVERITY_COLORS = SEVERITY_COLORS;
const ANOMALY_RESULT_TYPE = {
  BUCKET: 'bucket',
  RECORD: 'record',
  INFLUENCER: 'influencer'
};
exports.ANOMALY_RESULT_TYPE = ANOMALY_RESULT_TYPE;
const PARTITION_FIELDS = ['partition_field', 'over_field', 'by_field'];
exports.PARTITION_FIELDS = PARTITION_FIELDS;
const JOB_ID = 'job_id';
exports.JOB_ID = JOB_ID;
const PARTITION_FIELD_VALUE = 'partition_field_value';
exports.PARTITION_FIELD_VALUE = PARTITION_FIELD_VALUE;