"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJobServiceProvider = getJobServiceProvider;

var _job_service = require("../../models/job_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getJobServiceProvider(getGuards) {
  return {
    jobServiceProvider(request, savedObjectsClient) {
      return {
        jobsSummary: async (...args) => {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(({
            scopedClient,
            mlClient
          }) => {
            const {
              jobsSummary
            } = (0, _job_service.jobServiceProvider)(scopedClient, mlClient);
            return jobsSummary(...args);
          });
        }
      };
    }

  };
}