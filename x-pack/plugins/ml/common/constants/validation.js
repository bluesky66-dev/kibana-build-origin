"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JOB_ID_MAX_LENGTH = exports.ALLOWED_DATA_UNITS = exports.SKIP_BUCKET_SPAN_ESTIMATION = exports.VALIDATION_STATUS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let VALIDATION_STATUS;
exports.VALIDATION_STATUS = VALIDATION_STATUS;

(function (VALIDATION_STATUS) {
  VALIDATION_STATUS["ERROR"] = "error";
  VALIDATION_STATUS["INFO"] = "info";
  VALIDATION_STATUS["SUCCESS"] = "success";
  VALIDATION_STATUS["WARNING"] = "warning";
})(VALIDATION_STATUS || (exports.VALIDATION_STATUS = VALIDATION_STATUS = {}));

const SKIP_BUCKET_SPAN_ESTIMATION = true;
exports.SKIP_BUCKET_SPAN_ESTIMATION = SKIP_BUCKET_SPAN_ESTIMATION;
const ALLOWED_DATA_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
exports.ALLOWED_DATA_UNITS = ALLOWED_DATA_UNITS;
const JOB_ID_MAX_LENGTH = 64;
exports.JOB_ID_MAX_LENGTH = JOB_ID_MAX_LENGTH;