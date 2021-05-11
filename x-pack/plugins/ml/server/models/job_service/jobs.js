"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobsProvider = jobsProvider;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _job_utils = require("../../../common/util/job_utils");

var _states = require("../../../common/constants/states");

var _calendars = require("../../../common/constants/calendars");

var _datafeeds = require("./datafeeds");

var _job_audit_messages = require("../job_audit_messages");

var _results_service = require("../results_service");

var _calendar = require("../calendar");

var _error_utils = require("./error_utils");

var _groups = require("./groups");

var _object_utils = require("../../../common/util/object_utils");

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


function jobsProvider(client, mlClient) {
  const {
    asInternalUser
  } = client;
  const {
    forceDeleteDatafeed,
    getDatafeedIdsByJobId,
    getDatafeedByJobId
  } = (0, _datafeeds.datafeedsProvider)(mlClient);
  const {
    getAuditMessagesSummary
  } = (0, _job_audit_messages.jobAuditMessagesProvider)(client, mlClient);
  const {
    getLatestBucketTimestampByJob
  } = (0, _results_service.resultsServiceProvider)(mlClient);
  const calMngr = new _calendar.CalendarManager(mlClient);

  async function forceDeleteJob(jobId) {
    await mlClient.deleteJob({
      job_id: jobId,
      force: true,
      wait_for_completion: false
    });
  }

  async function deleteJobs(jobIds) {
    const results = {};
    const datafeedIds = await getDatafeedIdsByJobId();

    for (const jobId of jobIds) {
      try {
        const datafeedResp = datafeedIds[jobId] === undefined ? {
          acknowledged: true
        } : await forceDeleteDatafeed(datafeedIds[jobId]);

        if (datafeedResp.acknowledged) {
          try {
            await forceDeleteJob(jobId);
            results[jobId] = {
              deleted: true
            };
          } catch (error) {
            if ((0, _error_utils.isRequestTimeout)(error)) {
              return (0, _error_utils.fillResultsWithTimeouts)(results, jobId, jobIds, _states.DATAFEED_STATE.DELETED);
            }

            results[jobId] = {
              deleted: false,
              error: error.body
            };
          }
        }
      } catch (error) {
        if ((0, _error_utils.isRequestTimeout)(error)) {
          return (0, _error_utils.fillResultsWithTimeouts)(results, datafeedIds[jobId], jobIds, _states.DATAFEED_STATE.DELETED);
        }

        results[jobId] = {
          deleted: false,
          error: error.body
        };
      }
    }

    return results;
  }

  async function closeJobs(jobIds) {
    const results = {};

    for (const jobId of jobIds) {
      try {
        await mlClient.closeJob({
          job_id: jobId
        });
        results[jobId] = {
          closed: true
        };
      } catch (error) {
        var _error$body$error;

        if ((0, _error_utils.isRequestTimeout)(error)) {
          return (0, _error_utils.fillResultsWithTimeouts)(results, jobId, jobIds, _states.JOB_STATE.CLOSED);
        }

        if (error.statusCode === 409 && (_error$body$error = error.body.error) !== null && _error$body$error !== void 0 && _error$body$error.reason && error.body.error.reason.includes('datafeed') === false) {
          // the close job request may fail (409) if the job has failed or if the datafeed hasn't been stopped.
          // if the job has failed we want to attempt a force close.
          // however, if we received a 409 due to the datafeed being started we should not attempt a force close.
          try {
            await mlClient.closeJob({
              job_id: jobId,
              force: true
            });
            results[jobId] = {
              closed: true
            };
          } catch (error2) {
            if ((0, _error_utils.isRequestTimeout)(error2)) {
              return (0, _error_utils.fillResultsWithTimeouts)(results, jobId, jobIds, _states.JOB_STATE.CLOSED);
            }

            results[jobId] = {
              closed: false,
              error: error2.body
            };
          }
        } else {
          results[jobId] = {
            closed: false,
            error: error.body
          };
        }
      }
    }

    return results;
  }

  async function forceStopAndCloseJob(jobId) {
    const datafeedIds = await getDatafeedIdsByJobId();
    const datafeedId = datafeedIds[jobId];

    if (datafeedId === undefined) {
      throw _boom.default.notFound(`Cannot find datafeed for job ${jobId}`);
    }

    const {
      body
    } = await mlClient.stopDatafeed({
      datafeed_id: datafeedId,
      force: true
    });

    if (body.stopped !== true) {
      return {
        success: false
      };
    }

    await mlClient.closeJob({
      job_id: jobId,
      force: true
    });
    return {
      success: true
    };
  }

  async function jobsSummary(jobIds = []) {
    const fullJobsList = await createFullJobsList();
    const fullJobsIds = fullJobsList.map(job => job.job_id);
    let auditMessagesByJob = {}; // even if there are errors getting the audit messages, we still want to show the full list

    try {
      const auditMessages = await getAuditMessagesSummary(fullJobsIds);
      auditMessagesByJob = auditMessages.reduce((acc, cur) => {
        acc[cur.job_id] = cur;
        return acc;
      }, auditMessagesByJob);
    } catch (e) {// fail silently
    }

    const deletingStr = _i18n.i18n.translate('xpack.ml.models.jobService.deletingJob', {
      defaultMessage: 'deleting'
    });

    const jobs = fullJobsList.map(job => {
      var _job$data_counts, _job$analysis_config;

      const hasDatafeed = (0, _object_utils.isPopulatedObject)(job.datafeed_config);
      const dataCounts = job.data_counts;
      const errorMessage = (0, _job_utils.getSingleMetricViewerJobErrorMessage)(job);
      const tempJob = {
        id: job.job_id,
        description: job.description || '',
        groups: Array.isArray(job.groups) ? job.groups.sort() : [],
        processed_record_count: (_job$data_counts = job.data_counts) === null || _job$data_counts === void 0 ? void 0 : _job$data_counts.processed_record_count,
        earliestStartTimestampMs: (0, _job_utils.getEarliestDatafeedStartTime)(dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.latest_record_timestamp, dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.latest_bucket_timestamp, (0, _job_utils.parseTimeIntervalForJob)((_job$analysis_config = job.analysis_config) === null || _job$analysis_config === void 0 ? void 0 : _job$analysis_config.bucket_span)),
        memory_status: job.model_size_stats ? job.model_size_stats.memory_status : '',
        jobState: job.deleting === true ? deletingStr : job.state,
        hasDatafeed,
        datafeedId: hasDatafeed && job.datafeed_config.datafeed_id ? job.datafeed_config.datafeed_id : '',
        datafeedIndices: hasDatafeed && job.datafeed_config.indices ? job.datafeed_config.indices : [],
        datafeedState: hasDatafeed && job.datafeed_config.state ? job.datafeed_config.state : '',
        latestTimestampMs: dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.latest_record_timestamp,
        earliestTimestampMs: dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.earliest_record_timestamp,
        latestResultsTimestampMs: (0, _job_utils.getLatestDataOrBucketTimestamp)(dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.latest_record_timestamp, dataCounts === null || dataCounts === void 0 ? void 0 : dataCounts.latest_bucket_timestamp),
        isSingleMetricViewerJob: errorMessage === undefined,
        isNotSingleMetricViewerJobMessage: errorMessage,
        nodeName: job.node ? job.node.name : undefined,
        deleting: job.deleting || undefined,
        awaitingNodeAssignment: isJobAwaitingNodeAssignment(job)
      };

      if (jobIds.find(j => j === tempJob.id)) {
        tempJob.fullJob = job;
      }

      const auditMessage = auditMessagesByJob[tempJob.id];

      if (auditMessage !== undefined && job.create_time !== undefined && job.create_time <= auditMessage.msgTime) {
        tempJob.auditMessage = {
          level: auditMessage.highestLevel,
          text: auditMessage.highestLevelText
        };
      }

      return tempJob;
    });
    return jobs;
  }

  async function jobsWithTimerange() {
    const fullJobsList = await createFullJobsList();
    const jobsMap = {};
    const jobs = fullJobsList.map(job => {
      jobsMap[job.job_id] = job.groups || [];
      const hasDatafeed = (0, _object_utils.isPopulatedObject)(job.datafeed_config);
      const timeRange = {};
      const dataCounts = job.data_counts;

      if (dataCounts !== undefined) {
        timeRange.to = (0, _job_utils.getLatestDataOrBucketTimestamp)(dataCounts.latest_record_timestamp, dataCounts.latest_bucket_timestamp);
        timeRange.from = dataCounts.earliest_record_timestamp;
      }

      const errorMessage = (0, _job_utils.getSingleMetricViewerJobErrorMessage)(job);
      const tempJob = {
        id: job.job_id,
        job_id: job.job_id,
        groups: Array.isArray(job.groups) ? job.groups.sort() : [],
        isRunning: hasDatafeed && job.datafeed_config.state === 'started',
        isSingleMetricViewerJob: errorMessage === undefined,
        isNotSingleMetricViewerJobMessage: errorMessage,
        timeRange
      };
      return tempJob;
    });
    return {
      jobs,
      jobsMap
    };
  }

  async function getJobForCloning(jobId) {
    const [{
      body: jobResults
    }, datafeedResult] = await Promise.all([mlClient.getJobs({
      job_id: jobId,
      exclude_generated: true
    }), getDatafeedByJobId(jobId, true)]);
    const result = {
      job: undefined,
      datafeed: undefined
    };

    if (datafeedResult && datafeedResult.job_id === jobId) {
      result.datafeed = datafeedResult;
    }

    if (jobResults && jobResults.jobs) {
      const job = jobResults.jobs.find(j => j.job_id === jobId);

      if (job) {
        result.job = job;
      }
    }

    return result;
  }

  async function createFullJobsList(jobIds = []) {
    const jobs = [];
    const groups = {};
    const datafeeds = {};
    const calendarsByJobId = {};
    const globalCalendars = [];
    const jobIdsString = jobIds.join();
    const [{
      body: jobResults
    }, {
      body: jobStatsResults
    }, {
      body: datafeedResults
    }, {
      body: datafeedStatsResults
    }, calendarResults, latestBucketTimestampByJob] = await Promise.all([mlClient.getJobs(jobIds.length > 0 ? {
      job_id: jobIdsString
    } : undefined), mlClient.getJobStats(jobIds.length > 0 ? {
      job_id: jobIdsString
    } : undefined), mlClient.getDatafeeds(), mlClient.getDatafeedStats(), calMngr.getAllCalendars(), getLatestBucketTimestampByJob()]);

    if (datafeedResults && datafeedResults.datafeeds) {
      datafeedResults.datafeeds.forEach(datafeed => {
        if (datafeedStatsResults && datafeedStatsResults.datafeeds) {
          const datafeedStats = datafeedStatsResults.datafeeds.find(ds => ds.datafeed_id === datafeed.datafeed_id);

          if (datafeedStats) {
            datafeeds[datafeed.job_id] = { ...datafeed,
              ...datafeedStats
            };
          }
        }
      });
    } // create list of jobs per group.
    // used for assigning calendars to jobs when a calendar has
    // only been attached to a group


    if (jobResults && jobResults.jobs) {
      jobResults.jobs.forEach(job => {
        calendarsByJobId[job.job_id] = [];

        if (job.groups !== undefined) {
          job.groups.forEach(gId => {
            if (groups[gId] === undefined) {
              groups[gId] = [];
            }

            groups[gId].push(job.job_id);
          });
        }
      });
    } // assign calendars to jobs


    if (calendarResults) {
      calendarResults.forEach(cal => {
        cal.job_ids.forEach(id => {
          if (id === _calendars.GLOBAL_CALENDAR) {
            globalCalendars.push(cal.calendar_id);
          } else if (groups[id]) {
            groups[id].forEach(jId => {
              if (calendarsByJobId[jId] !== undefined) {
                calendarsByJobId[jId].push(cal.calendar_id);
              }
            });
          } else {
            if (calendarsByJobId[id] !== undefined) {
              calendarsByJobId[id].push(cal.calendar_id);
            }
          }
        });
      }); // de-duplicate calendars

      for (const cal in calendarsByJobId) {
        if (calendarsByJobId.hasOwnProperty(cal)) {
          calendarsByJobId[cal] = (0, _lodash.uniq)(calendarsByJobId[cal]);
        }
      }
    } // create jobs objects containing job stats, datafeeds, datafeed stats and calendars


    if (jobResults && jobResults.jobs) {
      jobResults.jobs.forEach(job => {
        let tempJob = job;
        const calendars = [...(calendarsByJobId[tempJob.job_id] || []), ...(globalCalendars || [])];

        if (calendars.length) {
          tempJob.calendars = calendars;
        }

        if (jobStatsResults && jobStatsResults.jobs) {
          const jobStats = jobStatsResults.jobs.find(js => js.job_id === tempJob.job_id);

          if (jobStats !== undefined) {
            tempJob = { ...tempJob,
              ...jobStats
            };

            if (jobStats.node) {
              tempJob.node = jobStats.node;
            }

            if (jobStats.open_time) {
              tempJob.open_time = jobStats.open_time;
            } // Add in the timestamp of the last bucket processed for each job if available.


            const latestBucketTimestamp = latestBucketTimestampByJob && latestBucketTimestampByJob[tempJob.job_id];

            if (latestBucketTimestamp) {
              tempJob.data_counts.latest_bucket_timestamp = latestBucketTimestamp;
            }
          }
        }

        const datafeed = datafeeds[tempJob.job_id];

        if (datafeed !== undefined) {
          tempJob.datafeed_config = datafeed;
        }

        jobs.push(tempJob);
      });
    }

    return jobs;
  }

  async function deletingJobTasks() {
    const actions = ['cluster:admin/xpack/ml/job/delete'];
    const detailed = true;
    const jobIds = [];

    try {
      const {
        body
      } = await asInternalUser.tasks.list({
        actions,
        detailed
      });
      Object.keys(body.nodes).forEach(nodeId => {
        const tasks = body.nodes[nodeId].tasks;
        Object.keys(tasks).forEach(taskId => {
          jobIds.push(tasks[taskId].description.replace(/^delete-job-/, ''));
        });
      });
    } catch (e) {
      // if the user doesn't have permission to load the task list,
      // use the jobs list to get the ids of deleting jobs
      const {
        body: {
          jobs
        }
      } = await mlClient.getJobs();
      jobIds.push(...jobs.filter(j => j.deleting === true).map(j => j.job_id));
    }

    return {
      jobIds
    };
  } // Checks if each of the jobs in the specified list of IDs exist.
  // Job IDs in supplied array may contain wildcard '*' characters
  // e.g. *_low_request_rate_ecs


  async function jobsExist(jobIds = [], allSpaces = false) {
    const results = {};

    for (const jobId of jobIds) {
      try {
        if (jobId === '') {
          results[jobId] = {
            exists: false,
            isGroup: false
          };
          continue;
        }

        const {
          body
        } = allSpaces ? await client.asInternalUser.ml.getJobs({
          job_id: jobId
        }) : await mlClient.getJobs({
          job_id: jobId
        });
        const isGroup = body.jobs.some(j => j.groups !== undefined && j.groups.includes(jobId));
        results[jobId] = {
          exists: body.count > 0,
          isGroup
        };
      } catch (e) {
        // if a non-wildcarded job id is supplied, the get jobs endpoint will 404
        if (e.statusCode !== 404) {
          throw e;
        }

        results[jobId] = {
          exists: false,
          isGroup: false
        };
      }
    }

    return results;
  }

  async function getAllJobAndGroupIds() {
    const {
      getAllGroups
    } = (0, _groups.groupsProvider)(mlClient);
    const {
      body
    } = await mlClient.getJobs();
    const jobIds = body.jobs.map(job => job.job_id);
    const groups = await getAllGroups();
    const groupIds = groups.map(group => group.id);
    return {
      jobIds,
      groupIds
    };
  }

  async function getLookBackProgress(jobId, start, end) {
    const datafeedId = `datafeed-${jobId}`;
    const [{
      body
    }, isRunning] = await Promise.all([mlClient.getJobStats({
      job_id: jobId
    }), isDatafeedRunning(datafeedId)]);

    if (body.jobs.length) {
      const statsForJob = body.jobs[0];
      const time = statsForJob.data_counts.latest_record_timestamp;
      const progress = (time - start) / (end - start);
      const isJobClosed = statsForJob.state === _states.JOB_STATE.CLOSED;
      return {
        progress: progress > 0 ? Math.round(progress * 100) : 0,
        isRunning,
        isJobClosed
      };
    }

    return {
      progress: 0,
      isRunning: false,
      isJobClosed: true
    };
  }

  async function isDatafeedRunning(datafeedId) {
    const {
      body
    } = await mlClient.getDatafeedStats({
      datafeed_id: datafeedId
    });

    if (body.datafeeds.length) {
      const state = body.datafeeds[0].state;
      return state === _states.DATAFEED_STATE.STARTED || state === _states.DATAFEED_STATE.STARTING || state === _states.DATAFEED_STATE.STOPPING;
    }

    return false;
  }

  function isJobAwaitingNodeAssignment(job) {
    return job.node === undefined && job.state === _states.JOB_STATE.OPENING;
  }

  return {
    forceDeleteJob,
    deleteJobs,
    closeJobs,
    forceStopAndCloseJob,
    jobsSummary,
    jobsWithTimerange,
    getJobForCloning,
    createFullJobsList,
    deletingJobTasks,
    jobsExist,
    getAllJobAndGroupIds,
    getLookBackProgress
  };
}