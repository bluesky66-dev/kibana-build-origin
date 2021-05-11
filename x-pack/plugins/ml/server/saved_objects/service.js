"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobSavedObjectServiceFactory = jobSavedObjectServiceFactory;
exports.createError = createError;

var _re = _interopRequireDefault(require("re2"));

var _saved_objects = require("../../common/types/saved_objects");

var _ml_client = require("../lib/ml_client");

var _util = require("./util");

var _authorization = require("./authorization");

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


function jobSavedObjectServiceFactory(savedObjectsClient, internalSavedObjectsClient, spacesEnabled, authorization, isMlReady) {
  async function _getJobObjects(jobType, jobId, datafeedId, currentSpaceOnly = true) {
    await isMlReady();
    const filterObject = {};

    if (jobType !== undefined) {
      filterObject.type = jobType;
    }

    if (jobId !== undefined) {
      filterObject.job_id = jobId;
    } else if (datafeedId !== undefined) {
      filterObject.datafeed_id = datafeedId;
    }

    const {
      filter,
      searchFields
    } = createSavedObjectFilter(filterObject);
    const options = {
      type: _saved_objects.ML_SAVED_OBJECT_TYPE,
      perPage: 10000,
      ...(spacesEnabled === false || currentSpaceOnly === true ? {} : {
        namespaces: ['*']
      }),
      searchFields,
      filter
    };
    const jobs = await savedObjectsClient.find(options);
    return jobs.saved_objects;
  }

  async function _createJob(jobType, jobId, datafeedId) {
    await isMlReady();
    const job = {
      job_id: jobId,
      datafeed_id: datafeedId !== null && datafeedId !== void 0 ? datafeedId : null,
      type: jobType
    };
    const id = savedObjectId(job);

    try {
      const [existingJobObject] = await getAllJobObjectsForAllSpaces(jobType, jobId);

      if (existingJobObject !== undefined) {
        var _existingJobObject$na; // a saved object for this job already exists, this may be left over from a previously deleted job


        if ((_existingJobObject$na = existingJobObject.namespaces) !== null && _existingJobObject$na !== void 0 && _existingJobObject$na.length) {
          // use a force delete just in case the saved object exists only in another space.
          await _forceDeleteJob(jobType, jobId, existingJobObject.namespaces[0]);
        } else {
          // the saved object has no spaces, this is unexpected, attempt a normal delete
          await savedObjectsClient.delete(_saved_objects.ML_SAVED_OBJECT_TYPE, id, {
            force: true
          });
        }
      }
    } catch (error) {// the saved object may exist if a previous job with the same ID has been deleted.
      // if not, this error will be throw which we ignore.
    }

    await savedObjectsClient.create(_saved_objects.ML_SAVED_OBJECT_TYPE, job, {
      id
    });
  }

  async function _bulkCreateJobs(jobs) {
    await isMlReady();
    return await savedObjectsClient.bulkCreate(jobs.map(j => ({
      type: _saved_objects.ML_SAVED_OBJECT_TYPE,
      id: savedObjectId(j.job),
      attributes: j.job,
      initialNamespaces: j.namespaces
    })));
  }

  function savedObjectId(job) {
    return `${job.type}-${job.job_id}`;
  }

  async function _deleteJob(jobType, jobId) {
    const jobs = await _getJobObjects(jobType, jobId);
    const job = jobs[0];

    if (job === undefined) {
      throw new _ml_client.MLJobNotFound('job not found');
    }

    await savedObjectsClient.delete(_saved_objects.ML_SAVED_OBJECT_TYPE, job.id, {
      force: true
    });
  }

  async function _forceDeleteJob(jobType, jobId, namespace) {
    const id = savedObjectId({
      job_id: jobId,
      datafeed_id: null,
      type: jobType
    }); // * space cannot be used in a delete call, so use undefined which
    // is the same as specifying the default space

    await internalSavedObjectsClient.delete(_saved_objects.ML_SAVED_OBJECT_TYPE, id, {
      namespace: namespace === '*' ? undefined : namespace,
      force: true
    });
  }

  async function createAnomalyDetectionJob(jobId, datafeedId) {
    await _createJob('anomaly-detector', jobId, datafeedId);
  }

  async function deleteAnomalyDetectionJob(jobId) {
    await _deleteJob('anomaly-detector', jobId);
  }

  async function forceDeleteAnomalyDetectionJob(jobId, namespace) {
    await _forceDeleteJob('anomaly-detector', jobId, namespace);
  }

  async function createDataFrameAnalyticsJob(jobId) {
    await _createJob('data-frame-analytics', jobId);
  }

  async function deleteDataFrameAnalyticsJob(jobId) {
    await _deleteJob('data-frame-analytics', jobId);
  }

  async function forceDeleteDataFrameAnalyticsJob(jobId, namespace) {
    await _forceDeleteJob('data-frame-analytics', jobId, namespace);
  }

  async function bulkCreateJobs(jobs) {
    return await _bulkCreateJobs(jobs);
  }

  async function getAllJobObjects(jobType, currentSpaceOnly = true) {
    return await _getJobObjects(jobType, undefined, undefined, currentSpaceOnly);
  }

  async function getJobObject(jobType, jobId, currentSpaceOnly = true) {
    const [jobObject] = await _getJobObjects(jobType, jobId, undefined, currentSpaceOnly);
    return jobObject;
  }

  async function getAllJobObjectsForAllSpaces(jobType, jobId) {
    await isMlReady();
    const filterObject = {};

    if (jobType !== undefined) {
      filterObject.type = jobType;
    }

    if (jobId !== undefined) {
      filterObject.job_id = jobId;
    }

    const {
      filter,
      searchFields
    } = createSavedObjectFilter(filterObject);
    const options = {
      type: _saved_objects.ML_SAVED_OBJECT_TYPE,
      perPage: 10000,
      ...(spacesEnabled === false ? {} : {
        namespaces: ['*']
      }),
      searchFields,
      filter
    };
    return (await internalSavedObjectsClient.find(options)).saved_objects;
  }

  async function addDatafeed(datafeedId, jobId) {
    const jobs = await _getJobObjects('anomaly-detector', jobId);
    const job = jobs[0];

    if (job === undefined) {
      throw new _ml_client.MLJobNotFound(`'${datafeedId}' not found`);
    }

    const jobObject = job.attributes;
    jobObject.datafeed_id = datafeedId;
    await savedObjectsClient.update(_saved_objects.ML_SAVED_OBJECT_TYPE, job.id, jobObject);
  }

  async function deleteDatafeed(datafeedId) {
    const jobs = await _getJobObjects('anomaly-detector', undefined, datafeedId);
    const job = jobs[0];

    if (job === undefined) {
      throw new _ml_client.MLJobNotFound(`'${datafeedId}' not found`);
    }

    const jobObject = job.attributes;
    jobObject.datafeed_id = null;
    await savedObjectsClient.update(_saved_objects.ML_SAVED_OBJECT_TYPE, job.id, jobObject);
  }

  async function getIds(jobType, idType) {
    const jobs = await _getJobObjects(jobType);
    return jobs.map(o => o.attributes[idType]);
  }

  async function filterJobObjectsForSpace(jobType, list, field, key) {
    if (list.length === 0) {
      return [];
    }

    const jobIds = await getIds(jobType, key);
    return list.filter(j => jobIds.includes(j[field]));
  }

  async function filterJobsForSpace(jobType, list, field) {
    return filterJobObjectsForSpace(jobType, list, field, 'job_id');
  }

  async function filterDatafeedsForSpace(jobType, list, field) {
    return filterJobObjectsForSpace(jobType, list, field, 'datafeed_id');
  }

  async function filterJobObjectIdsForSpace(jobType, ids, key, allowWildcards = false) {
    if (ids.length === 0) {
      return [];
    }

    const jobIds = await getIds(jobType, key); // check to see if any of the ids supplied contain a wildcard

    if (allowWildcards === false || ids.join().match('\\*') === null) {
      // wildcards are not allowed or no wildcards could be found
      return ids.filter(id => jobIds.includes(id));
    } // if any of the ids contain a wildcard, check each one.


    return ids.filter(id => {
      if (id.match('\\*') === null) {
        return jobIds.includes(id);
      }

      const regex = new _re.default(id.replace('*', '.*'));
      return jobIds.some(jId => typeof jId === 'string' && regex.exec(jId));
    });
  }

  async function filterJobIdsForSpace(jobType, ids, allowWildcards = false) {
    return filterJobObjectIdsForSpace(jobType, ids, 'job_id', allowWildcards);
  }

  async function filterDatafeedIdsForSpace(ids, allowWildcards = false) {
    return filterJobObjectIdsForSpace('anomaly-detector', ids, 'datafeed_id', allowWildcards);
  }

  async function assignJobsToSpaces(jobType, jobIds, spaces) {
    const results = {};
    const jobs = await _getJobObjects(jobType);

    for (const id of jobIds) {
      const job = jobs.find(j => j.attributes.job_id === id);

      if (job === undefined) {
        results[id] = {
          success: false,
          error: createError(id, 'job_id')
        };
      } else {
        try {
          await savedObjectsClient.addToNamespaces(_saved_objects.ML_SAVED_OBJECT_TYPE, job.id, spaces);
          results[id] = {
            success: true
          };
        } catch (error) {
          results[id] = {
            success: false,
            error: (0, _util.getSavedObjectClientError)(error)
          };
        }
      }
    }

    return results;
  }

  async function removeJobsFromSpaces(jobType, jobIds, spaces) {
    const results = {};
    const jobs = await _getJobObjects(jobType);

    for (const job of jobs) {
      if (jobIds.includes(job.attributes.job_id)) {
        try {
          await savedObjectsClient.deleteFromNamespaces(_saved_objects.ML_SAVED_OBJECT_TYPE, job.id, spaces);
          results[job.attributes.job_id] = {
            success: true
          };
        } catch (error) {
          results[job.attributes.job_id] = {
            success: false,
            error: (0, _util.getSavedObjectClientError)(error)
          };
        }
      }
    }

    return results;
  }

  async function canCreateGlobalJobs(request) {
    if (authorization === undefined) {
      return true;
    }

    const {
      authorizationCheck
    } = (0, _authorization.authorizationProvider)(authorization);
    return (await authorizationCheck(request)).canCreateGlobally;
  }

  return {
    getAllJobObjects,
    getJobObject,
    createAnomalyDetectionJob,
    createDataFrameAnalyticsJob,
    deleteAnomalyDetectionJob,
    forceDeleteAnomalyDetectionJob,
    deleteDataFrameAnalyticsJob,
    forceDeleteDataFrameAnalyticsJob,
    addDatafeed,
    deleteDatafeed,
    filterJobsForSpace,
    filterJobIdsForSpace,
    filterDatafeedsForSpace,
    filterDatafeedIdsForSpace,
    assignJobsToSpaces,
    removeJobsFromSpaces,
    bulkCreateJobs,
    getAllJobObjectsForAllSpaces,
    canCreateGlobalJobs
  };
}

function createError(id, key) {
  let reason = `'${id}' not found`;

  if (key === 'job_id') {
    reason = `No known job with id '${id}'`;
  } else if (key === 'datafeed_id') {
    reason = `No known datafeed with id '${id}'`;
  }

  return {
    error: {
      reason
    },
    status: 404
  };
}

function createSavedObjectFilter(filterObject) {
  const searchFields = [];
  const filter = Object.entries(filterObject).map(([k, v]) => {
    searchFields.push(k);
    return `${_saved_objects.ML_SAVED_OBJECT_TYPE}.attributes.${k}: "${v}"`;
  }).join(' AND ');
  return {
    filter,
    searchFields
  };
}