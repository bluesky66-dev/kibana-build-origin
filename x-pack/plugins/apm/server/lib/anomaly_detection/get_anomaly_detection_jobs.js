"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnomalyDetectionJobs = getAnomalyDetectionJobs;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _anomaly_detection = require("../../../common/anomaly_detection");

var _get_ml_jobs_with_apm_group = require("./get_ml_jobs_with_apm_group");

var _with_apm_span = require("../../utils/with_apm_span");

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


function getAnomalyDetectionJobs(setup, logger) {
  const {
    ml
  } = setup;

  if (!ml) {
    throw _boom.default.notImplemented(_anomaly_detection.ML_ERRORS.ML_NOT_AVAILABLE);
  }

  return (0, _with_apm_span.withApmSpan)('get_anomaly_detection_jobs', async () => {
    const mlCapabilities = await (0, _with_apm_span.withApmSpan)('get_ml_capabilities', () => ml.mlSystem.mlCapabilities());

    if (!mlCapabilities.mlFeatureEnabledInSpace) {
      throw _boom.default.forbidden(_anomaly_detection.ML_ERRORS.ML_NOT_AVAILABLE_IN_SPACE);
    }

    const response = await (0, _get_ml_jobs_with_apm_group.getMlJobsWithAPMGroup)(ml.anomalyDetectors);
    return response.jobs.filter(job => {
      var _job$custom_settings$, _job$custom_settings, _job$custom_settings$2;

      return ((_job$custom_settings$ = (_job$custom_settings = job.custom_settings) === null || _job$custom_settings === void 0 ? void 0 : (_job$custom_settings$2 = _job$custom_settings.job_tags) === null || _job$custom_settings$2 === void 0 ? void 0 : _job$custom_settings$2.apm_ml_version) !== null && _job$custom_settings$ !== void 0 ? _job$custom_settings$ : 0) >= 2;
    }).map(job => {
      var _job$custom_settings$3, _job$custom_settings2, _job$custom_settings3;

      const environment = (_job$custom_settings$3 = (_job$custom_settings2 = job.custom_settings) === null || _job$custom_settings2 === void 0 ? void 0 : (_job$custom_settings3 = _job$custom_settings2.job_tags) === null || _job$custom_settings3 === void 0 ? void 0 : _job$custom_settings3.environment) !== null && _job$custom_settings$3 !== void 0 ? _job$custom_settings$3 : '';
      return {
        job_id: job.job_id,
        environment
      };
    });
  });
}