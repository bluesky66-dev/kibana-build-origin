"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSeverity = getSeverity;
exports.getSeverityColor = getSeverityColor;
exports.ML_ERRORS = void 0;

var _i18n = require("@kbn/i18n");

var _common = require("../../ml/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getSeverity(score) {
  if (score === undefined) {
    return _common.ANOMALY_SEVERITY.UNKNOWN;
  }

  return (0, _common.getSeverityType)(score);
}

function getSeverityColor(score) {
  return (0, _common.getSeverityColor)(score);
}

const ML_ERRORS = {
  INVALID_LICENSE: _i18n.i18n.translate('xpack.apm.anomaly_detection.error.invalid_license', {
    defaultMessage: `To use anomaly detection, you must be subscribed to an Elastic Platinum license. With it, you'll be able to monitor your services with the aid of machine learning.`
  }),
  MISSING_READ_PRIVILEGES: _i18n.i18n.translate('xpack.apm.anomaly_detection.error.missing_read_privileges', {
    defaultMessage: 'You must have "read" privileges to Machine Learning and APM in order to view Anomaly Detection jobs'
  }),
  MISSING_WRITE_PRIVILEGES: _i18n.i18n.translate('xpack.apm.anomaly_detection.error.missing_write_privileges', {
    defaultMessage: 'You must have "write" privileges to Machine Learning and APM in order to create Anomaly Detection jobs'
  }),
  ML_NOT_AVAILABLE: _i18n.i18n.translate('xpack.apm.anomaly_detection.error.not_available', {
    defaultMessage: 'Machine learning is not available'
  }),
  ML_NOT_AVAILABLE_IN_SPACE: _i18n.i18n.translate('xpack.apm.anomaly_detection.error.not_available_in_space', {
    defaultMessage: 'Machine learning is not available in the selected space'
  })
};
exports.ML_ERRORS = ML_ERRORS;