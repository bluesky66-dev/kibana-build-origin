"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnomalyDetectorsProvider = getAnomalyDetectorsProvider;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getAnomalyDetectorsProvider(getGuards) {
  return {
    anomalyDetectorsProvider(request, savedObjectsClient) {
      return {
        async jobs(jobId) {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(async ({
            mlClient
          }) => {
            const {
              body
            } = await mlClient.getJobs(jobId !== undefined ? {
              job_id: jobId
            } : undefined);
            return body;
          });
        },

        async jobStats(jobId) {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(async ({
            mlClient
          }) => {
            const {
              body
            } = await mlClient.getJobStats(jobId !== undefined ? {
              job_id: jobId
            } : undefined);
            return body;
          });
        },

        async datafeeds(datafeedId) {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetDatafeeds']).ok(async ({
            mlClient
          }) => {
            const {
              body
            } = await mlClient.getDatafeeds(datafeedId !== undefined ? {
              datafeed_id: datafeedId
            } : undefined);
            return body;
          });
        },

        async datafeedStats(datafeedId) {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetDatafeeds']).ok(async ({
            mlClient
          }) => {
            const {
              body
            } = await mlClient.getDatafeedStats(datafeedId !== undefined ? {
              datafeed_id: datafeedId
            } : undefined);
            return body;
          });
        }

      };
    }

  };
}