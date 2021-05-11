"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectsRoutes = savedObjectsRoutes;

var _error_wrapper = require("../client/error_wrapper");

var _saved_objects = require("../saved_objects");

var _saved_objects2 = require("./schemas/saved_objects");

var _spaces_utils = require("../lib/spaces_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Routes for job saved object management
 */


function savedObjectsRoutes({
  router,
  routeGuard
}, {
  getSpaces,
  resolveMlCapabilities
}) {
  /**
   * @apiGroup JobSavedObjects
   *
   * @api {get} /api/ml/saved_objects/status Get job saved object status
   * @apiName SavedObjectsStatus
   * @apiDescription Lists all jobs and saved objects to view the relationship status between them
   *
   */
  router.get({
    path: '/api/ml/saved_objects/status',
    validate: false,
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    response,
    jobSavedObjectService
  }) => {
    try {
      const {
        checkStatus
      } = (0, _saved_objects.checksFactory)(client, jobSavedObjectService);
      const status = await checkStatus();
      return response.ok({
        body: status
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup JobSavedObjects
   *
   * @api {get} /api/ml/saved_objects/sync Sync job saved objects
   * @apiName SyncJobSavedObjects
   * @apiDescription Create saved objects for jobs which are missing them.
   *                 Delete saved objects for jobs which no longer exist.
   *                 Update missing datafeed ids in saved objects for datafeeds which exist.
   *                 Remove datafeed ids for datafeeds which no longer exist.
   *
   */

  router.get({
    path: '/api/ml/saved_objects/sync',
    validate: {
      query: _saved_objects2.syncJobObjects
    },
    options: {
      tags: ['access:ml:canCreateJob', 'access:ml:canCreateDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response,
    jobSavedObjectService
  }) => {
    try {
      const {
        simulate
      } = request.query;
      const {
        syncSavedObjects
      } = (0, _saved_objects.syncSavedObjectsFactory)(client, jobSavedObjectService);
      const savedObjects = await syncSavedObjects(simulate);
      return response.ok({
        body: savedObjects
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup JobSavedObjects
   *
   * @api {get} /api/ml/saved_objects/initialize Create job saved objects for all jobs
   * @apiName InitializeJobSavedObjects
   * @apiDescription Create saved objects for jobs which are missing them.
   *
   */

  router.get({
    path: '/api/ml/saved_objects/initialize',
    validate: {
      query: _saved_objects2.syncJobObjects
    },
    options: {
      tags: ['access:ml:canCreateJob', 'access:ml:canCreateDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response,
    jobSavedObjectService
  }) => {
    try {
      const {
        simulate
      } = request.query;
      const {
        initSavedObjects
      } = (0, _saved_objects.syncSavedObjectsFactory)(client, jobSavedObjectService);
      const savedObjects = await initSavedObjects(simulate);
      return response.ok({
        body: savedObjects
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup JobSavedObjects
   *
   * @api {post} /api/ml/saved_objects/assign_job_to_space Assign jobs to spaces
   * @apiName AssignJobsToSpaces
   * @apiDescription Add list of spaces to a list of jobs
   *
   * @apiSchema (body) jobsAndSpaces
   */

  router.post({
    path: '/api/ml/saved_objects/assign_job_to_space',
    validate: {
      body: _saved_objects2.jobsAndSpaces
    },
    options: {
      tags: ['access:ml:canCreateJob', 'access:ml:canCreateDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    request,
    response,
    jobSavedObjectService
  }) => {
    try {
      const {
        jobType,
        jobIds,
        spaces
      } = request.body;
      const body = await jobSavedObjectService.assignJobsToSpaces(jobType, jobIds, spaces);
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup JobSavedObjects
   *
   * @api {post} /api/ml/saved_objects/remove_job_from_space Remove jobs from spaces
   * @apiName RemoveJobsFromSpaces
   * @apiDescription Remove a list of spaces from a list of jobs
   *
   * @apiSchema (body) jobsAndSpaces
   */

  router.post({
    path: '/api/ml/saved_objects/remove_job_from_space',
    validate: {
      body: _saved_objects2.jobsAndSpaces
    },
    options: {
      tags: ['access:ml:canCreateJob', 'access:ml:canCreateDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    request,
    response,
    jobSavedObjectService
  }) => {
    try {
      const {
        jobType,
        jobIds,
        spaces
      } = request.body;
      const body = await jobSavedObjectService.removeJobsFromSpaces(jobType, jobIds, spaces);
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup JobSavedObjects
   *
   * @api {post} /api/ml/saved_objects/remove_job_from_current_space Remove jobs from the current space
   * @apiName RemoveJobsFromCurrentSpace
   * @apiDescription Remove a list of jobs from the current space
   *
   * @apiSchema (body) jobsAndCurrentSpace
   */

  router.post({
    path: '/api/ml/saved_objects/remove_job_from_current_space',
    validate: {
      body: _saved_objects2.jobsAndCurrentSpace
    },
    options: {
      tags: ['access:ml:canCreateJob', 'access:ml:canCreateDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    request,
    response,
    jobSavedObjectService
  }) => {
    try {
      const {
        jobType,
        jobIds
      } = request.body;
      const {
        getCurrentSpaceId
      } = (0, _spaces_utils.spacesUtilsProvider)(getSpaces, request);
      const currentSpaceId = await getCurrentSpaceId();

      if (currentSpaceId === null) {
        return response.ok({
          body: jobIds.map(id => ({
            [id]: {
              success: false,
              error: 'Cannot remove current space. Spaces plugin is disabled.'
            }
          }))
        });
      }

      const body = await jobSavedObjectService.removeJobsFromSpaces(jobType, jobIds, [currentSpaceId]);
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup JobSavedObjects
   *
   * @api {get} /api/ml/saved_objects/jobs_spaces All spaces in all jobs
   * @apiName JobsSpaces
   * @apiDescription List all jobs and their spaces
   *
   */

  router.get({
    path: '/api/ml/saved_objects/jobs_spaces',
    validate: false,
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    response,
    jobSavedObjectService,
    client
  }) => {
    try {
      const {
        checkStatus
      } = (0, _saved_objects.checksFactory)(client, jobSavedObjectService);
      const allStatuses = Object.values((await checkStatus()).savedObjects).flat();
      const body = allStatuses.filter(s => s.checks.jobExists).reduce((acc, cur) => {
        const type = cur.type;

        if (acc[type] === undefined) {
          acc[type] = {};
        }

        acc[type][cur.jobId] = cur.namespaces;
        return acc;
      }, {});
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup JobSavedObjects
   *
   * @api {post} /api/ml/saved_objects/can_delete_job Check whether user can delete a job
   * @apiName CanDeleteJob
   * @apiDescription Check the user's ability to delete jobs. Returns whether they are able
   *                 to fully delete the job and whether they are able to remove it from
   *                 the current space.
   *                 Note, this is only for enabling UI controls. A user calling endpoints
   *                 directly will still be able to delete or remove the job from a space.
   *
   * @apiSchema (params) jobTypeSchema
   * @apiSchema (body) jobIdsSchema
   * @apiSuccessExample {json} Error-Response:
   * {
   *   "my_job": {
   *     "canDelete": false,
   *     "canRemoveFromSpace": true
   *   }
   * }
   *
   */

  router.post({
    path: '/api/ml/saved_objects/can_delete_job/{jobType}',
    validate: {
      params: _saved_objects2.jobTypeSchema,
      body: _saved_objects2.canDeleteJobSchema
    },
    options: {
      tags: ['access:ml:canGetJobs', 'access:ml:canGetDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    request,
    response,
    jobSavedObjectService,
    client
  }) => {
    try {
      const {
        jobType
      } = request.params;
      const {
        jobIds
      } = request.body;
      const {
        canDeleteJobs
      } = (0, _saved_objects.checksFactory)(client, jobSavedObjectService);
      const body = await canDeleteJobs(request, jobType, jobIds, getSpaces !== undefined, resolveMlCapabilities);
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}