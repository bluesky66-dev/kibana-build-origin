"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerJobInfoRoutes = registerJobInfoRoutes;

var _configSchema = require("@kbn/config-schema");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _constants = require("../../common/constants");

var _authorized_user_pre_routing = require("./lib/authorized_user_pre_routing");

var _jobs_query = require("./lib/jobs_query");

var _job_response_handler = require("./lib/job_response_handler");

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


const MAIN_ENTRY = `${_constants.API_BASE_URL}/jobs`;

const handleUnavailable = res => {
  return res.custom({
    statusCode: 503,
    body: 'Not Available'
  });
};

function registerJobInfoRoutes(reporting) {
  const setupDeps = reporting.getPluginSetupDeps();
  const userHandler = (0, _authorized_user_pre_routing.authorizedUserPreRoutingFactory)(reporting);
  const {
    router
  } = setupDeps; // list jobs in the queue, paginated

  router.get({
    path: `${MAIN_ENTRY}/list`,
    validate: {
      query: _configSchema.schema.object({
        page: _configSchema.schema.string({
          defaultValue: '0'
        }),
        size: _configSchema.schema.string({
          defaultValue: '10'
        }),
        ids: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, userHandler(async (user, context, req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return handleUnavailable(res);
    }

    const {
      management: {
        jobTypes = []
      }
    } = await reporting.getLicenseInfo();
    const {
      page: queryPage = '0',
      size: querySize = '10',
      ids: queryIds = null
    } = req.query;
    const page = parseInt(queryPage, 10) || 0;
    const size = Math.min(100, parseInt(querySize, 10) || 10);
    const jobIds = queryIds ? queryIds.split(',') : null;
    const jobsQuery = (0, _jobs_query.jobsQueryFactory)(reporting);
    const results = await jobsQuery.list(jobTypes, user, page, size, jobIds);
    return res.ok({
      body: results,
      headers: {
        'content-type': 'application/json'
      }
    });
  })); // return the count of all jobs in the queue

  router.get({
    path: `${MAIN_ENTRY}/count`,
    validate: false
  }, userHandler(async (user, context, req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return handleUnavailable(res);
    }

    const {
      management: {
        jobTypes = []
      }
    } = await reporting.getLicenseInfo();
    const jobsQuery = (0, _jobs_query.jobsQueryFactory)(reporting);
    const count = await jobsQuery.count(jobTypes, user);
    return res.ok({
      body: count.toString(),
      headers: {
        'content-type': 'text/plain'
      }
    });
  })); // return the raw output from a job

  router.get({
    path: `${MAIN_ENTRY}/output/{docId}`,
    validate: {
      params: _configSchema.schema.object({
        docId: _configSchema.schema.string({
          minLength: 2
        })
      })
    }
  }, userHandler(async (user, context, req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return handleUnavailable(res);
    }

    const {
      docId
    } = req.params;
    const {
      management: {
        jobTypes = []
      }
    } = await reporting.getLicenseInfo();
    const jobsQuery = (0, _jobs_query.jobsQueryFactory)(reporting);
    const result = await jobsQuery.get(user, docId, {
      includeContent: true
    });

    if (!result) {
      throw _boom.default.notFound();
    }

    const {
      _source: {
        jobtype: jobType,
        output: jobOutput
      }
    } = result;

    if (!jobTypes.includes(jobType)) {
      throw _boom.default.unauthorized(`Sorry, you are not authorized to download ${jobType} reports`);
    }

    return res.ok({
      body: jobOutput || {},
      headers: {
        'content-type': 'application/json'
      }
    });
  })); // return some info about the job

  router.get({
    path: `${MAIN_ENTRY}/info/{docId}`,
    validate: {
      params: _configSchema.schema.object({
        docId: _configSchema.schema.string({
          minLength: 2
        })
      })
    }
  }, userHandler(async (user, context, req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return res.custom({
        statusCode: 503
      });
    }

    const {
      docId
    } = req.params;
    const {
      management: {
        jobTypes = []
      }
    } = await reporting.getLicenseInfo();
    const jobsQuery = (0, _jobs_query.jobsQueryFactory)(reporting);
    const result = await jobsQuery.get(user, docId);

    if (!result) {
      throw _boom.default.notFound();
    }

    const {
      _source: job
    } = result;
    const {
      jobtype: jobType,
      payload: jobPayload
    } = job;

    if (!jobTypes.includes(jobType)) {
      throw _boom.default.unauthorized(`Sorry, you are not authorized to view ${jobType} info`);
    }

    return res.ok({
      body: { ...job,
        payload: { ...jobPayload,
          headers: undefined
        }
      },
      headers: {
        'content-type': 'application/json'
      }
    });
  })); // trigger a download of the output from a job

  const downloadResponseHandler = (0, _job_response_handler.downloadJobResponseHandlerFactory)(reporting);
  router.get({
    path: `${MAIN_ENTRY}/download/{docId}`,
    validate: {
      params: _configSchema.schema.object({
        docId: _configSchema.schema.string({
          minLength: 3
        })
      })
    }
  }, userHandler(async (user, context, req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return handleUnavailable(res);
    }

    const {
      docId
    } = req.params;
    const {
      management: {
        jobTypes = []
      }
    } = await reporting.getLicenseInfo();
    return downloadResponseHandler(res, jobTypes, user, {
      docId
    });
  })); // allow a report to be deleted

  const deleteResponseHandler = (0, _job_response_handler.deleteJobResponseHandlerFactory)(reporting);
  router.delete({
    path: `${MAIN_ENTRY}/delete/{docId}`,
    validate: {
      params: _configSchema.schema.object({
        docId: _configSchema.schema.string({
          minLength: 3
        })
      })
    }
  }, userHandler(async (user, context, req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return handleUnavailable(res);
    }

    const {
      docId
    } = req.params;
    const {
      management: {
        jobTypes = []
      }
    } = await reporting.getLicenseInfo();
    return deleteResponseHandler(res, jobTypes, user, {
      docId
    });
  }));
}