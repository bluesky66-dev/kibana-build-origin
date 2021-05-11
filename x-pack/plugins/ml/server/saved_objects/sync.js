"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncSavedObjectsFactory = syncSavedObjectsFactory;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _checks = require("./checks");

var _util = require("./util");

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


function syncSavedObjectsFactory(client, jobSavedObjectService) {
  const {
    checkStatus
  } = (0, _checks.checksFactory)(client, jobSavedObjectService);

  async function syncSavedObjects(simulate = false) {
    const results = {
      savedObjectsCreated: {},
      savedObjectsDeleted: {},
      datafeedsAdded: {},
      datafeedsRemoved: {}
    };
    const {
      body: datafeeds
    } = await client.asInternalUser.ml.getDatafeeds();
    const tasks = [];
    const status = await checkStatus();

    for (const job of status.jobs['anomaly-detector']) {
      if (job.checks.savedObjectExits === false) {
        if (simulate === true) {
          results.savedObjectsCreated[job.jobId] = {
            success: true
          };
        } else {
          // create AD saved objects for jobs which are missing them
          const jobId = job.jobId;
          const datafeedId = job.datafeedId;
          tasks.push(async () => {
            try {
              await jobSavedObjectService.createAnomalyDetectionJob(jobId, datafeedId !== null && datafeedId !== void 0 ? datafeedId : undefined);
              results.savedObjectsCreated[job.jobId] = {
                success: true
              };
            } catch (error) {
              results.savedObjectsCreated[job.jobId] = {
                success: false,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      }
    }

    for (const job of status.jobs['data-frame-analytics']) {
      if (job.checks.savedObjectExits === false) {
        if (simulate === true) {
          results.savedObjectsCreated[job.jobId] = {
            success: true
          };
        } else {
          // create DFA saved objects for jobs which are missing them
          const jobId = job.jobId;
          tasks.push(async () => {
            try {
              await jobSavedObjectService.createDataFrameAnalyticsJob(jobId);
              results.savedObjectsCreated[job.jobId] = {
                success: true
              };
            } catch (error) {
              results.savedObjectsCreated[job.jobId] = {
                success: false,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      }
    }

    for (const job of status.savedObjects['anomaly-detector']) {
      if (job.checks.jobExists === false) {
        if (simulate === true) {
          results.savedObjectsDeleted[job.jobId] = {
            success: true
          };
        } else {
          // Delete AD saved objects for jobs which no longer exist
          const {
            jobId,
            namespaces
          } = job;
          tasks.push(async () => {
            try {
              if (namespaces !== undefined && namespaces.length) {
                await jobSavedObjectService.forceDeleteAnomalyDetectionJob(jobId, namespaces[0]);
              } else {
                await jobSavedObjectService.deleteAnomalyDetectionJob(jobId);
              }

              results.savedObjectsDeleted[job.jobId] = {
                success: true
              };
            } catch (error) {
              results.savedObjectsDeleted[job.jobId] = {
                success: false,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      }
    }

    for (const job of status.savedObjects['data-frame-analytics']) {
      if (job.checks.jobExists === false) {
        if (simulate === true) {
          results.savedObjectsDeleted[job.jobId] = {
            success: true
          };
        } else {
          // Delete DFA saved objects for jobs which no longer exist
          const {
            jobId,
            namespaces
          } = job;
          tasks.push(async () => {
            try {
              if (namespaces !== undefined && namespaces.length) {
                await jobSavedObjectService.forceDeleteDataFrameAnalyticsJob(jobId, namespaces[0]);
              } else {
                await jobSavedObjectService.deleteDataFrameAnalyticsJob(jobId);
              }

              results.savedObjectsDeleted[job.jobId] = {
                success: true
              };
            } catch (error) {
              results.savedObjectsDeleted[job.jobId] = {
                success: false,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      }
    }

    for (const job of status.savedObjects['anomaly-detector']) {
      if (job.checks.datafeedExists === true && job.datafeedId === null) {
        // add datafeed id for jobs where the datafeed exists but the id is missing from the saved object
        if (simulate === true) {
          results.datafeedsAdded[job.jobId] = {
            success: true
          };
        } else {
          const df = datafeeds.datafeeds.find(d => d.job_id === job.jobId);
          const jobId = job.jobId;
          const datafeedId = df === null || df === void 0 ? void 0 : df.datafeed_id;
          tasks.push(async () => {
            try {
              if (datafeedId !== undefined) {
                await jobSavedObjectService.addDatafeed(datafeedId, jobId);
              }

              results.datafeedsAdded[job.jobId] = {
                success: true
              };
            } catch (error) {
              results.datafeedsAdded[job.jobId] = {
                success: false,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      } else if (job.checks.jobExists === true && job.checks.datafeedExists === false && job.datafeedId !== null && job.datafeedId !== undefined) {
        // remove datafeed id for jobs where the datafeed no longer exists but the id is populated in the saved object
        if (simulate === true) {
          results.datafeedsRemoved[job.jobId] = {
            success: true
          };
        } else {
          const datafeedId = job.datafeedId;
          tasks.push(async () => {
            try {
              await jobSavedObjectService.deleteDatafeed(datafeedId);
              results.datafeedsRemoved[job.jobId] = {
                success: true
              };
            } catch (error) {
              results.datafeedsRemoved[job.jobId] = {
                success: false,
                error: (0, _util.getSavedObjectClientError)(error)
              };
            }
          });
        }
      }
    }

    await Promise.allSettled(tasks.map(t => t()));
    return results;
  }

  async function initSavedObjects(simulate = false, spaceOverrides) {
    const results = {
      jobs: [],
      success: true
    };
    const status = await checkStatus();
    const jobs = [];
    const types = ['anomaly-detector', 'data-frame-analytics'];
    types.forEach(type => {
      status.jobs[type].forEach(job => {
        if (job.checks.savedObjectExits === false) {
          if (simulate === true) {
            results.jobs.push({
              id: job.jobId,
              type
            });
          } else {
            var _job$datafeedId, _spaceOverrides$overr;

            jobs.push({
              job: {
                job_id: job.jobId,
                datafeed_id: (_job$datafeedId = job.datafeedId) !== null && _job$datafeedId !== void 0 ? _job$datafeedId : null,
                type
              },
              // allow some jobs to be assigned to specific spaces when initializing
              namespaces: (_spaceOverrides$overr = spaceOverrides === null || spaceOverrides === void 0 ? void 0 : spaceOverrides.overrides[type][job.jobId]) !== null && _spaceOverrides$overr !== void 0 ? _spaceOverrides$overr : ['*']
            });
          }
        }
      });
    });

    try {
      const createResults = await jobSavedObjectService.bulkCreateJobs(jobs);
      createResults.saved_objects.forEach(({
        attributes
      }) => {
        results.jobs.push({
          id: attributes.job_id,
          type: attributes.type
        });
      });
    } catch (error) {
      results.success = false;
      results.error = _boom.default.boomify(error).output;
    }

    return results;
  }

  return {
    checkStatus,
    syncSavedObjects,
    initSavedObjects
  };
}