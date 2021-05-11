"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checksFactory = checksFactory;

var _boom = _interopRequireDefault(require("@hapi/boom"));

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


function checksFactory(client, jobSavedObjectService) {
  async function checkStatus() {
    const jobObjects = await jobSavedObjectService.getAllJobObjects(undefined, false); // load all non-space jobs and datafeeds

    const {
      body: adJobs
    } = await client.asInternalUser.ml.getJobs();
    const {
      body: datafeeds
    } = await client.asInternalUser.ml.getDatafeeds();
    const {
      body: dfaJobs
    } = await client.asInternalUser.ml.getDataFrameAnalytics();
    const savedObjectsStatus = jobObjects.map(({
      attributes,
      namespaces
    }) => {
      const type = attributes.type;
      const jobId = attributes.job_id;
      const datafeedId = type === 'anomaly-detector' ? attributes.datafeed_id : undefined;
      let jobExists = false;
      let datafeedExists;

      if (type === 'anomaly-detector') {
        jobExists = adJobs.jobs.some(j => j.job_id === jobId);
        datafeedExists = datafeeds.datafeeds.some(d => d.job_id === jobId);
      } else {
        jobExists = dfaJobs.data_frame_analytics.some(j => j.id === jobId);
      }

      return {
        jobId,
        type,
        datafeedId,
        namespaces,
        checks: {
          jobExists,
          datafeedExists
        }
      };
    });
    const allJobObjects = await jobSavedObjectService.getAllJobObjectsForAllSpaces();
    const nonSpaceADObjectIds = new Set(allJobObjects.filter(({
      attributes
    }) => attributes.type === 'anomaly-detector').map(({
      attributes
    }) => attributes.job_id));
    const nonSpaceDFAObjectIds = new Set(allJobObjects.filter(({
      attributes
    }) => attributes.type === 'data-frame-analytics').map(({
      attributes
    }) => attributes.job_id));
    const adObjectIds = new Set(savedObjectsStatus.filter(({
      type
    }) => type === 'anomaly-detector').map(({
      jobId
    }) => jobId));
    const dfaObjectIds = new Set(savedObjectsStatus.filter(({
      type
    }) => type === 'data-frame-analytics').map(({
      jobId
    }) => jobId));
    const anomalyDetectors = adJobs.jobs.filter(({
      job_id: jobId
    }) => {
      // only list jobs which are in the current space (adObjectIds)
      // or are not in any spaces (nonSpaceADObjectIds)
      return adObjectIds.has(jobId) === true || nonSpaceADObjectIds.has(jobId) === false;
    }).map(({
      job_id: jobId
    }) => {
      var _datafeeds$datafeeds$;

      const datafeedId = (_datafeeds$datafeeds$ = datafeeds.datafeeds.find(df => df.job_id === jobId)) === null || _datafeeds$datafeeds$ === void 0 ? void 0 : _datafeeds$datafeeds$.datafeed_id;
      return {
        jobId,
        datafeedId: datafeedId !== null && datafeedId !== void 0 ? datafeedId : null,
        checks: {
          savedObjectExits: nonSpaceADObjectIds.has(jobId)
        }
      };
    });
    const dataFrameAnalytics = dfaJobs.data_frame_analytics.filter(({
      id: jobId
    }) => {
      // only list jobs which are in the current space (dfaObjectIds)
      // or are not in any spaces (nonSpaceDFAObjectIds)
      return dfaObjectIds.has(jobId) === true || nonSpaceDFAObjectIds.has(jobId) === false;
    }).map(({
      id: jobId
    }) => {
      return {
        jobId,
        datafeedId: null,
        checks: {
          savedObjectExits: nonSpaceDFAObjectIds.has(jobId)
        }
      };
    });
    return {
      savedObjects: {
        'anomaly-detector': savedObjectsStatus.filter(({
          type
        }) => type === 'anomaly-detector'),
        'data-frame-analytics': savedObjectsStatus.filter(({
          type
        }) => type === 'data-frame-analytics')
      },
      jobs: {
        'anomaly-detector': anomalyDetectors,
        'data-frame-analytics': dataFrameAnalytics
      }
    };
  }

  async function canDeleteJobs(request, jobType, jobIds, spacesEnabled, resolveMlCapabilities) {
    if (jobType !== 'anomaly-detector' && jobType !== 'data-frame-analytics') {
      throw _boom.default.badRequest('Job type must be "anomaly-detector" or "data-frame-analytics"');
    }

    const mlCapabilities = await resolveMlCapabilities(request);

    if (mlCapabilities === null) {
      throw _boom.default.internal('mlCapabilities is not defined');
    }

    if (jobType === 'anomaly-detector' && mlCapabilities.canDeleteJob === false || jobType === 'data-frame-analytics' && mlCapabilities.canDeleteDataFrameAnalytics === false) {
      // user does not have access to delete jobs.
      return jobIds.reduce((results, jobId) => {
        results[jobId] = {
          canDelete: false,
          canRemoveFromSpace: false
        };
        return results;
      }, {});
    }

    if (spacesEnabled === false) {
      // spaces are disabled, delete only no untagging
      return jobIds.reduce((results, jobId) => {
        results[jobId] = {
          canDelete: true,
          canRemoveFromSpace: false
        };
        return results;
      }, {});
    }

    const canCreateGlobalJobs = await jobSavedObjectService.canCreateGlobalJobs(request);
    const jobObjects = await Promise.all(jobIds.map(id => jobSavedObjectService.getJobObject(jobType, id)));
    return jobIds.reduce((results, jobId) => {
      const jobObject = jobObjects.find(j => (j === null || j === void 0 ? void 0 : j.attributes.job_id) === jobId);

      if (jobObject === undefined || jobObject.namespaces === undefined) {
        // job saved object not found
        results[jobId] = {
          canDelete: false,
          canRemoveFromSpace: false
        };
        return results;
      }

      const {
        namespaces
      } = jobObject;
      const isGlobalJob = namespaces.includes('*'); // job is in * space, user can see all spaces - delete and no option to untag

      if (canCreateGlobalJobs && isGlobalJob) {
        results[jobId] = {
          canDelete: true,
          canRemoveFromSpace: false
        };
        return results;
      } // job is in * space, user cannot see all spaces - no untagging, no deleting


      if (isGlobalJob) {
        results[jobId] = {
          canDelete: false,
          canRemoveFromSpace: false
        };
        return results;
      } // jobs with are in individual spaces can only be untagged
      // from current space if the job is in more than 1 space


      const canRemoveFromSpace = namespaces.length > 1; // job is in individual spaces, user cannot see all of them - untag only, no delete

      if (namespaces.includes('?')) {
        results[jobId] = {
          canDelete: false,
          canRemoveFromSpace
        };
        return results;
      } // job is individual spaces, user can see all of them - delete and option to untag


      results[jobId] = {
        canDelete: true,
        canRemoveFromSpace
      };
      return results;
    }, {});
  }

  return {
    checkStatus,
    canDeleteJobs
  };
}