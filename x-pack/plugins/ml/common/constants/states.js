"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JOB_STATE = exports.FORECAST_REQUEST_STATE = exports.DATAFEED_STATE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let DATAFEED_STATE;
exports.DATAFEED_STATE = DATAFEED_STATE;

(function (DATAFEED_STATE) {
  DATAFEED_STATE["STARTED"] = "started";
  DATAFEED_STATE["STARTING"] = "starting";
  DATAFEED_STATE["STOPPED"] = "stopped";
  DATAFEED_STATE["STOPPING"] = "stopping";
  DATAFEED_STATE["DELETED"] = "deleted";
})(DATAFEED_STATE || (exports.DATAFEED_STATE = DATAFEED_STATE = {}));

let FORECAST_REQUEST_STATE;
exports.FORECAST_REQUEST_STATE = FORECAST_REQUEST_STATE;

(function (FORECAST_REQUEST_STATE) {
  FORECAST_REQUEST_STATE["FAILED"] = "failed";
  FORECAST_REQUEST_STATE["FINISHED"] = "finished";
  FORECAST_REQUEST_STATE["SCHEDULED"] = "scheduled";
  FORECAST_REQUEST_STATE["STARTED"] = "started";
})(FORECAST_REQUEST_STATE || (exports.FORECAST_REQUEST_STATE = FORECAST_REQUEST_STATE = {}));

let JOB_STATE;
exports.JOB_STATE = JOB_STATE;

(function (JOB_STATE) {
  JOB_STATE["CLOSED"] = "closed";
  JOB_STATE["CLOSING"] = "closing";
  JOB_STATE["FAILED"] = "failed";
  JOB_STATE["OPENED"] = "opened";
  JOB_STATE["OPENING"] = "opening";
  JOB_STATE["DELETED"] = "deleted";
})(JOB_STATE || (exports.JOB_STATE = JOB_STATE = {}));