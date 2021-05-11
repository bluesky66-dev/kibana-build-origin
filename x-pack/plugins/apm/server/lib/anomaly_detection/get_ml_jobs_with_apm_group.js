"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMlJobsWithAPMGroup = getMlJobsWithAPMGroup;

var _with_apm_span = require("../../utils/with_apm_span");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// returns ml jobs containing "apm" group
// workaround: the ML api returns 404 when no jobs are found. This is handled so instead of throwing an empty response is returned


function getMlJobsWithAPMGroup(anomalyDetectors) {
  return (0, _with_apm_span.withApmSpan)('get_ml_jobs_with_apm_group', async () => {
    try {
      return await anomalyDetectors.jobs(_constants.APM_ML_JOB_GROUP);
    } catch (e) {
      if (e.statusCode === 404) {
        return {
          count: 0,
          jobs: []
        };
      }

      throw e;
    }
  });
}