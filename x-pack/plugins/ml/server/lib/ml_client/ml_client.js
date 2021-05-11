"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMlClient = getMlClient;

var _search = require("./search");

var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getMlClient(client, jobSavedObjectService) {
  const mlClient = client.asInternalUser.ml;

  async function jobIdsCheck(jobType, p, allowWildcards = false) {
    const jobIds = jobType === 'anomaly-detector' ? getADJobIdsFromRequest(p) : getDFAJobIdsFromRequest(p);

    if (jobIds.length) {
      await checkIds(jobType, jobIds, allowWildcards);
    }
  }

  async function checkIds(jobType, jobIds, allowWildcards = false) {
    const filteredJobIds = await jobSavedObjectService.filterJobIdsForSpace(jobType, jobIds);
    let missingIds = jobIds.filter(j => filteredJobIds.indexOf(j) === -1);

    if (allowWildcards === true && missingIds.join().match('\\*') !== null) {
      // filter out wildcard ids from the error
      missingIds = missingIds.filter(id => id.match('\\*') === null);
    }

    if (missingIds.length) {
      throw new _errors.MLJobNotFound(`No known job with id '${missingIds.join(',')}'`);
    }
  }

  async function groupIdsCheck(p, allJobs, filteredJobIds) {
    // if job ids have been specified, we need to check in case any of them are actually
    // group ids, which will be unknown to the saved objects.
    // find which ids are not group ids and check them.
    const ids = getADJobIdsFromRequest(p);

    if (ids.length) {
      // find all groups from unfiltered jobs
      const responseGroupIds = [...new Set(allJobs.map(j => {
        var _j$groups;

        return (_j$groups = j.groups) !== null && _j$groups !== void 0 ? _j$groups : [];
      }).flat())]; // work out which ids requested are actually groups and which are jobs

      const requestedGroupIds = [];
      const requestedJobIds = [];
      ids.forEach(id => {
        if (responseGroupIds.includes(id)) {
          requestedGroupIds.push(id);
        } else {
          requestedJobIds.push(id);
        }
      }); // find all groups from filtered jobs

      const groupIdsFromFilteredJobs = [...new Set(allJobs.filter(j => filteredJobIds.includes(j.job_id)).map(j => {
        var _j$groups2;

        return (_j$groups2 = j.groups) !== null && _j$groups2 !== void 0 ? _j$groups2 : [];
      }).flat())];
      const groupsIdsThatDidNotMatch = requestedGroupIds.filter(id => groupIdsFromFilteredJobs.includes(id) === false);

      if (groupsIdsThatDidNotMatch.length) {
        // if there are group ids which were requested but didn't
        // exist in filtered jobs, list them in an error
        throw new _errors.MLJobNotFound(`No known job with id '${groupsIdsThatDidNotMatch.join(',')}'`);
      } // check the remaining jobs ids


      if (requestedJobIds.length) {
        await checkIds('anomaly-detector', requestedJobIds, true);
      }
    }
  }

  async function groupIdsCheckFromJobStats(filteredJobIds, ...p) {
    // similar to groupIdsCheck above, however we need to load the jobs first to get the groups information
    const ids = getADJobIdsFromRequest(p);

    if (ids.length) {
      const {
        body
      } = await mlClient.getJobs(...p);
      await groupIdsCheck(p, body.jobs, filteredJobIds);
    }
  }

  async function datafeedIdsCheck(p, allowWildcards = false) {
    const datafeedIds = getDatafeedIdsFromRequest(p);

    if (datafeedIds.length) {
      const filteredDatafeedIds = await jobSavedObjectService.filterDatafeedIdsForSpace(datafeedIds);
      let missingIds = datafeedIds.filter(j => filteredDatafeedIds.indexOf(j) === -1);

      if (allowWildcards === true && missingIds.join().match('\\*') !== null) {
        // filter out wildcard ids from the error
        missingIds = missingIds.filter(id => id.match('\\*') === null);
      }

      if (missingIds.length) {
        throw new _errors.MLJobNotFound(`No known datafeed with id '${missingIds.join(',')}'`);
      }
    }
  }

  return {
    async closeJob(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.closeJob(...p);
    },

    async deleteCalendar(...p) {
      return mlClient.deleteCalendar(...p);
    },

    async deleteCalendarEvent(...p) {
      return mlClient.deleteCalendarEvent(...p);
    },

    async deleteCalendarJob(...p) {
      return mlClient.deleteCalendarJob(...p);
    },

    async deleteDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p);
      const resp = await mlClient.deleteDataFrameAnalytics(...p); // don't delete the job saved object as the real job will not be
      // deleted initially and could still fail.

      return resp;
    },

    async deleteDatafeed(...p) {
      await datafeedIdsCheck(p);
      const resp = await mlClient.deleteDatafeed(...p);
      const [datafeedId] = getDatafeedIdsFromRequest(p);

      if (datafeedId !== undefined) {
        await jobSavedObjectService.deleteDatafeed(datafeedId);
      }

      return resp;
    },

    async deleteExpiredData(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.deleteExpiredData(...p);
    },

    async deleteFilter(...p) {
      return mlClient.deleteFilter(...p);
    },

    async deleteForecast(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.deleteForecast(...p);
    },

    async deleteJob(...p) {
      await jobIdsCheck('anomaly-detector', p);
      const resp = await mlClient.deleteJob(...p); // don't delete the job saved object as the real job will not be
      // deleted initially and could still fail.

      return resp;
    },

    async deleteModelSnapshot(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.deleteModelSnapshot(...p);
    },

    async deleteTrainedModel(...p) {
      return mlClient.deleteTrainedModel(...p);
    },

    async estimateModelMemory(...p) {
      return mlClient.estimateModelMemory(...p);
    },

    async evaluateDataFrame(...p) {
      return mlClient.evaluateDataFrame(...p);
    },

    async explainDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p);
      return mlClient.explainDataFrameAnalytics(...p);
    },

    async findFileStructure(...p) {
      return mlClient.findFileStructure(...p);
    },

    async flushJob(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.flushJob(...p);
    },

    async forecast(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.forecast(...p);
    },

    async getBuckets(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getBuckets(...p);
    },

    async getCalendarEvents(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getCalendarEvents(...p);
    },

    async getCalendars(...p) {
      const {
        body
      } = await mlClient.getCalendars(...p);
      const {
        body: {
          jobs: allJobs
        }
      } = await mlClient.getJobs();
      const allJobIds = allJobs.map(j => j.job_id); // flatten the list of all jobs ids and check which ones are valid

      const calJobIds = [...new Set(body.calendars.map(c => c.job_ids).flat())]; // find groups by getting the cal job ids which aren't real jobs.

      const groups = calJobIds.filter(j => allJobIds.includes(j) === false); // get list of calendar jobs which are allowed in this space

      const filteredJobIds = await jobSavedObjectService.filterJobIdsForSpace('anomaly-detector', calJobIds);
      const calendars = body.calendars.map(c => ({ ...c,
        job_ids: c.job_ids.filter(id => filteredJobIds.includes(id) || groups.includes(id)),
        total_job_count: calJobIds.length
      }));
      return {
        body: { ...body,
          calendars
        }
      };
    },

    async getCategories(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getCategories(...p);
    },

    async getDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p, true);

      try {
        const {
          body
        } = await mlClient.getDataFrameAnalytics(...p);
        const jobs = await jobSavedObjectService.filterJobsForSpace('data-frame-analytics', body.data_frame_analytics, 'id');
        return {
          body: { ...body,
            count: jobs.length,
            data_frame_analytics: jobs
          }
        };
      } catch (error) {
        var _error$body;

        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }

        throw (_error$body = error.body) !== null && _error$body !== void 0 ? _error$body : error;
      }
    },

    async getDataFrameAnalyticsStats(...p) {
      // this should use DataFrameAnalyticsStats, but needs a refactor to move DataFrameAnalyticsStats to common
      await jobIdsCheck('data-frame-analytics', p, true);

      try {
        const {
          body
        } = await mlClient.getDataFrameAnalyticsStats(...p);
        const jobs = await jobSavedObjectService.filterJobsForSpace('data-frame-analytics', body.data_frame_analytics, 'id');
        return {
          body: { ...body,
            count: jobs.length,
            data_frame_analytics: jobs
          }
        };
      } catch (error) {
        var _error$body2;

        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }

        throw (_error$body2 = error.body) !== null && _error$body2 !== void 0 ? _error$body2 : error;
      }
    },

    async getDatafeedStats(...p) {
      await datafeedIdsCheck(p, true);

      try {
        const {
          body
        } = await mlClient.getDatafeedStats(...p);
        const datafeeds = await jobSavedObjectService.filterDatafeedsForSpace('anomaly-detector', body.datafeeds, 'datafeed_id');
        return {
          body: { ...body,
            count: datafeeds.length,
            datafeeds
          }
        };
      } catch (error) {
        var _error$body3;

        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }

        throw (_error$body3 = error.body) !== null && _error$body3 !== void 0 ? _error$body3 : error;
      }
    },

    async getDatafeeds(...p) {
      await datafeedIdsCheck(p, true);

      try {
        const {
          body
        } = await mlClient.getDatafeeds(...p);
        const datafeeds = await jobSavedObjectService.filterDatafeedsForSpace('anomaly-detector', body.datafeeds, 'datafeed_id');
        return {
          body: { ...body,
            count: datafeeds.length,
            datafeeds
          }
        };
      } catch (error) {
        var _error$body4;

        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }

        throw (_error$body4 = error.body) !== null && _error$body4 !== void 0 ? _error$body4 : error;
      }
    },

    async getFilters(...p) {
      return mlClient.getFilters(...p);
    },

    async getInfluencers(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getInfluencers(...p);
    },

    async getJobStats(...p) {
      try {
        const {
          body
        } = await mlClient.getJobStats(...p);
        const jobs = await jobSavedObjectService.filterJobsForSpace('anomaly-detector', body.jobs, 'job_id');
        await groupIdsCheckFromJobStats(jobs.map(j => j.job_id), ...p);
        return {
          body: { ...body,
            count: jobs.length,
            jobs
          }
        };
      } catch (error) {
        var _error$body5;

        if (error instanceof _errors.MLJobNotFound) {
          throw error;
        }

        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }

        throw (_error$body5 = error.body) !== null && _error$body5 !== void 0 ? _error$body5 : error;
      }
    },

    async getJobs(...p) {
      try {
        const {
          body
        } = await mlClient.getJobs(...p);
        const jobs = await jobSavedObjectService.filterJobsForSpace('anomaly-detector', body.jobs, 'job_id');
        await groupIdsCheck(p, body.jobs, jobs.map(j => j.job_id));
        return {
          body: { ...body,
            count: jobs.length,
            jobs
          }
        };
      } catch (error) {
        var _error$body6;

        if (error instanceof _errors.MLJobNotFound) {
          throw error;
        }

        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }

        throw (_error$body6 = error.body) !== null && _error$body6 !== void 0 ? _error$body6 : error;
      }
    },

    async getModelSnapshots(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getModelSnapshots(...p);
    },

    async getOverallBuckets(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getOverallBuckets(...p);
    },

    async getRecords(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getRecords(...p);
    },

    async getTrainedModels(...p) {
      return mlClient.getTrainedModels(...p);
    },

    async getTrainedModelsStats(...p) {
      return mlClient.getTrainedModelsStats(...p);
    },

    async info(...p) {
      return mlClient.info(...p);
    },

    async openJob(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.openJob(...p);
    },

    async postCalendarEvents(...p) {
      return mlClient.postCalendarEvents(...p);
    },

    async postData(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.postData(...p);
    },

    async previewDatafeed(...p) {
      await datafeedIdsCheck(p);
      return mlClient.previewDatafeed(...p);
    },

    async putCalendar(...p) {
      return mlClient.putCalendar(...p);
    },

    async putCalendarJob(...p) {
      return mlClient.putCalendarJob(...p);
    },

    async putDataFrameAnalytics(...p) {
      const resp = await mlClient.putDataFrameAnalytics(...p);
      const [analyticsId] = getDFAJobIdsFromRequest(p);

      if (analyticsId !== undefined) {
        await jobSavedObjectService.createDataFrameAnalyticsJob(analyticsId);
      }

      return resp;
    },

    async putDatafeed(...p) {
      const resp = await mlClient.putDatafeed(...p);
      const [datafeedId] = getDatafeedIdsFromRequest(p);
      const jobId = getJobIdFromBody(p);

      if (datafeedId !== undefined && jobId !== undefined) {
        await jobSavedObjectService.addDatafeed(datafeedId, jobId);
      }

      return resp;
    },

    async putFilter(...p) {
      return mlClient.putFilter(...p);
    },

    async putJob(...p) {
      const resp = await mlClient.putJob(...p);
      const [jobId] = getADJobIdsFromRequest(p);

      if (jobId !== undefined) {
        await jobSavedObjectService.createAnomalyDetectionJob(jobId);
      }

      return resp;
    },

    async putTrainedModel(...p) {
      return mlClient.putTrainedModel(...p);
    },

    async revertModelSnapshot(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.revertModelSnapshot(...p);
    },

    async setUpgradeMode(...p) {
      return mlClient.setUpgradeMode(...p);
    },

    async startDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p);
      return mlClient.startDataFrameAnalytics(...p);
    },

    async startDatafeed(...p) {
      await datafeedIdsCheck(p);
      return mlClient.startDatafeed(...p);
    },

    async stopDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p);
      return mlClient.stopDataFrameAnalytics(...p);
    },

    async stopDatafeed(...p) {
      await datafeedIdsCheck(p);
      return mlClient.stopDatafeed(...p);
    },

    async updateDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p);
      return mlClient.updateDataFrameAnalytics(...p);
    },

    async updateDatafeed(...p) {
      await datafeedIdsCheck(p);
      return mlClient.updateDatafeed(...p);
    },

    async updateFilter(...p) {
      return mlClient.updateFilter(...p);
    },

    async updateJob(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.updateJob(...p);
    },

    async updateModelSnapshot(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.updateModelSnapshot(...p);
    },

    async validate(...p) {
      return mlClient.validate(...p);
    },

    async validateDetector(...p) {
      return mlClient.validateDetector(...p);
    },

    ...(0, _search.searchProvider)(client, jobSavedObjectService)
  };
}

function getDFAJobIdsFromRequest([params]) {
  var _params$id;

  const ids = params === null || params === void 0 ? void 0 : (_params$id = params.id) === null || _params$id === void 0 ? void 0 : _params$id.split(',');
  return ids || [];
}

function getADJobIdsFromRequest([params]) {
  var _params$job_id;

  const ids = params === null || params === void 0 ? void 0 : (_params$job_id = params.job_id) === null || _params$job_id === void 0 ? void 0 : _params$job_id.split(',');
  return ids || [];
}

function getDatafeedIdsFromRequest([params]) {
  var _params$datafeed_id;

  const ids = params === null || params === void 0 ? void 0 : (_params$datafeed_id = params.datafeed_id) === null || _params$datafeed_id === void 0 ? void 0 : _params$datafeed_id.split(',');
  return ids || [];
}

function getJobIdFromBody(p) {
  var _params$body;

  const [params] = p;
  return params === null || params === void 0 ? void 0 : (_params$body = params.body) === null || _params$body === void 0 ? void 0 : _params$body.job_id;
}