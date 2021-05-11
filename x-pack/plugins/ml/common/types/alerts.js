"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRecordAnomalyAlertDoc = isRecordAnomalyAlertDoc;
exports.isBucketAnomalyAlertDoc = isBucketAnomalyAlertDoc;
exports.isInfluencerAnomalyAlertDoc = isInfluencerAnomalyAlertDoc;

var _anomalies = require("../constants/anomalies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isRecordAnomalyAlertDoc(arg) {
  return arg.hasOwnProperty('result_type') && arg.result_type === _anomalies.ANOMALY_RESULT_TYPE.RECORD;
}

function isBucketAnomalyAlertDoc(arg) {
  return arg.hasOwnProperty('result_type') && arg.result_type === _anomalies.ANOMALY_RESULT_TYPE.BUCKET;
}

function isInfluencerAnomalyAlertDoc(arg) {
  return arg.hasOwnProperty('result_type') && arg.result_type === _anomalies.ANOMALY_RESULT_TYPE.INFLUENCER;
}