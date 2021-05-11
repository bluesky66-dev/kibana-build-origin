"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasLegacyJobs = hasLegacyJobs;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _anomaly_detection = require("../../../common/anomaly_detection");

var _with_apm_span = require("../../utils/with_apm_span");

var _get_ml_jobs_with_apm_group = require("./get_ml_jobs_with_apm_group");

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
// Determine whether there are any legacy ml jobs.
// A legacy ML job has a job id that ends with "high_mean_response_time" and created_by=ml-module-apm-transaction


function hasLegacyJobs(setup) {
  const {
    ml
  } = setup;

  if (!ml) {
    throw _boom.default.notImplemented(_anomaly_detection.ML_ERRORS.ML_NOT_AVAILABLE);
  }

  return (0, _with_apm_span.withApmSpan)('has_legacy_jobs', async () => {
    const mlCapabilities = await (0, _with_apm_span.withApmSpan)('get_ml_capabilities', () => ml.mlSystem.mlCapabilities());

    if (!mlCapabilities.mlFeatureEnabledInSpace) {
      throw _boom.default.forbidden(_anomaly_detection.ML_ERRORS.ML_NOT_AVAILABLE_IN_SPACE);
    }

    const response = await (0, _get_ml_jobs_with_apm_group.getMlJobsWithAPMGroup)(ml.anomalyDetectors);
    return response.jobs.some(job => {
      var _job$custom_settings;

      return job.job_id.endsWith('high_mean_response_time') && ((_job$custom_settings = job.custom_settings) === null || _job$custom_settings === void 0 ? void 0 : _job$custom_settings.created_by) === 'ml-module-apm-transaction';
    });
  });
}