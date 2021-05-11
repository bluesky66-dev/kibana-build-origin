"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datafeedsProvider = datafeedsProvider;

var _i18n = require("@kbn/i18n");

var _states = require("../../../common/constants/states");

var _error_utils = require("./error_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function datafeedsProvider(mlClient) {
  async function forceStartDatafeeds(datafeedIds, start, end) {
    const jobIds = await getJobIdsByDatafeedId();
    const doStartsCalled = datafeedIds.reduce((acc, cur) => {
      acc[cur] = false;
      return acc;
    }, {});
    const results = {};

    async function doStart(datafeedId) {
      if (doStartsCalled[datafeedId] === false) {
        doStartsCalled[datafeedId] = true;

        try {
          await startDatafeed(datafeedId, start, end);
          return {
            started: true
          };
        } catch ({
          body
        }) {
          return {
            started: false,
            error: body
          };
        }
      } else {
        return {
          started: true
        };
      }
    }

    for (const datafeedId of datafeedIds) {
      const jobId = jobIds[datafeedId];

      if (jobId !== undefined) {
        try {
          if (await openJob(jobId)) {
            results[datafeedId] = await doStart(datafeedId);
          }
        } catch (error) {
          if ((0, _error_utils.isRequestTimeout)(error)) {
            // if the open request times out, start the datafeed anyway
            // then break out of the loop so no more requests are fired.
            // use fillResultsWithTimeouts to add a timeout error to each
            // remaining job
            results[datafeedId] = await doStart(datafeedId);
            return (0, _error_utils.fillResultsWithTimeouts)(results, datafeedId, datafeedIds, _states.JOB_STATE.OPENED);
          }

          results[datafeedId] = {
            started: false,
            error: error.body
          };
        }
      } else {
        results[datafeedId] = {
          started: false,
          error: _i18n.i18n.translate('xpack.ml.models.jobService.jobHasNoDatafeedErrorMessage', {
            defaultMessage: 'Job has no datafeed'
          })
        };
      }
    }

    return results;
  }

  async function openJob(jobId) {
    let opened = false;

    try {
      const {
        body
      } = await mlClient.openJob({
        job_id: jobId
      });
      opened = body.opened;
    } catch (error) {
      if (error.statusCode === 409) {
        opened = true;
      } else {
        throw error;
      }
    }

    return opened;
  }

  async function startDatafeed(datafeedId, start, end) {
    return mlClient.startDatafeed({
      datafeed_id: datafeedId,
      start: start,
      end: end
    });
  }

  async function stopDatafeeds(datafeedIds) {
    const results = {};

    for (const datafeedId of datafeedIds) {
      try {
        const {
          body
        } = await mlClient.stopDatafeed({
          datafeed_id: datafeedId
        });
        results[datafeedId] = body;
      } catch (error) {
        if ((0, _error_utils.isRequestTimeout)(error)) {
          return (0, _error_utils.fillResultsWithTimeouts)(results, datafeedId, datafeedIds, _states.DATAFEED_STATE.STOPPED);
        } else {
          results[datafeedId] = {
            started: false,
            error: error.body
          };
        }
      }
    }

    return results;
  }

  async function forceDeleteDatafeed(datafeedId) {
    const {
      body
    } = await mlClient.deleteDatafeed({
      datafeed_id: datafeedId,
      force: true
    });
    return body;
  }

  async function getDatafeedIdsByJobId() {
    const {
      body: {
        datafeeds
      }
    } = await mlClient.getDatafeeds();
    return datafeeds.reduce((acc, cur) => {
      acc[cur.job_id] = cur.datafeed_id;
      return acc;
    }, {});
  }

  async function getJobIdsByDatafeedId() {
    const {
      body: {
        datafeeds
      }
    } = await mlClient.getDatafeeds();
    return datafeeds.reduce((acc, cur) => {
      acc[cur.datafeed_id] = cur.job_id;
      return acc;
    }, {});
  }

  async function getDatafeedByJobId(jobId, excludeGenerated) {
    async function findDatafeed() {
      // if the job was doesn't use the standard datafeedId format
      // get all the datafeeds and match it with the jobId
      const {
        body: {
          datafeeds
        }
      } = await mlClient.getDatafeeds(excludeGenerated ? {
        exclude_generated: true
      } : {});

      for (const result of datafeeds) {
        if (result.job_id === jobId) {
          return result;
        }
      }
    } // if the job was created by the wizard,
    // then we can assume it uses the standard format of the datafeedId


    const assumedDefaultDatafeedId = `datafeed-${jobId}`;

    try {
      const {
        body: {
          datafeeds: datafeedsResults
        }
      } = await mlClient.getDatafeeds({
        datafeed_id: assumedDefaultDatafeedId,
        ...(excludeGenerated ? {
          exclude_generated: true
        } : {})
      });

      if (Array.isArray(datafeedsResults) && datafeedsResults.length === 1 && datafeedsResults[0].job_id === jobId) {
        return datafeedsResults[0];
      } else {
        return await findDatafeed();
      }
    } catch (e) {
      // if assumedDefaultDatafeedId does not exist, ES will throw an error
      return await findDatafeed();
    }
  }

  return {
    forceStartDatafeeds,
    stopDatafeeds,
    forceDeleteDatafeed,
    getDatafeedIdsByJobId,
    getJobIdsByDatafeedId,
    getDatafeedByJobId
  };
}