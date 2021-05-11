"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALERT_PREVIEW_SAMPLE_SIZE = exports.ML_ALERT_TYPES_CONFIG = exports.THRESHOLD_MET_GROUP = exports.ANOMALY_SCORE_MATCH_GROUP_ID = exports.ML_ALERT_TYPES = void 0;

var _i18n = require("@kbn/i18n");

var _license = require("../license");

var _app = require("./app");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ML_ALERT_TYPES = {
  ANOMALY_DETECTION: 'xpack.ml.anomaly_detection_alert'
};
exports.ML_ALERT_TYPES = ML_ALERT_TYPES;
const ANOMALY_SCORE_MATCH_GROUP_ID = 'anomaly_score_match';
exports.ANOMALY_SCORE_MATCH_GROUP_ID = ANOMALY_SCORE_MATCH_GROUP_ID;
const THRESHOLD_MET_GROUP = {
  id: ANOMALY_SCORE_MATCH_GROUP_ID,
  name: _i18n.i18n.translate('xpack.ml.anomalyDetectionAlert.actionGroupName', {
    defaultMessage: 'Anomaly score matched the condition'
  })
};
exports.THRESHOLD_MET_GROUP = THRESHOLD_MET_GROUP;
const ML_ALERT_TYPES_CONFIG = {
  [ML_ALERT_TYPES.ANOMALY_DETECTION]: {
    name: _i18n.i18n.translate('xpack.ml.anomalyDetectionAlert.name', {
      defaultMessage: 'Anomaly detection alert'
    }),
    actionGroups: [THRESHOLD_MET_GROUP],
    defaultActionGroupId: ANOMALY_SCORE_MATCH_GROUP_ID,
    minimumLicenseRequired: _license.MINIMUM_FULL_LICENSE,
    producer: _app.PLUGIN_ID
  }
};
exports.ML_ALERT_TYPES_CONFIG = ML_ALERT_TYPES_CONFIG;
const ALERT_PREVIEW_SAMPLE_SIZE = 5;
exports.ALERT_PREVIEW_SAMPLE_SIZE = ALERT_PREVIEW_SAMPLE_SIZE;