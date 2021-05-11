"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobAuditMessagesRoutes = jobAuditMessagesRoutes;

var _error_wrapper = require("../client/error_wrapper");

var _job_audit_messages = require("../models/job_audit_messages");

var _job_audit_messages_schema = require("./schemas/job_audit_messages_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Routes for job audit message routes
 */


function jobAuditMessagesRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup JobAuditMessages
   *
   * @api {get} /api/ml/job_audit_messages/messages/:jobId Get audit messages
   * @apiName GetJobAuditMessages
   * @apiDescription Returns audit messages for specified job ID
   *
   * @apiSchema (params) jobAuditMessagesJobIdSchema
   * @apiSchema (query) jobAuditMessagesQuerySchema
   */
  router.get({
    path: '/api/ml/job_audit_messages/messages/{jobId}',
    validate: {
      params: _job_audit_messages_schema.jobAuditMessagesJobIdSchema,
      query: _job_audit_messages_schema.jobAuditMessagesQuerySchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response,
    jobSavedObjectService
  }) => {
    try {
      const {
        getJobAuditMessages
      } = (0, _job_audit_messages.jobAuditMessagesProvider)(client, mlClient);
      const {
        jobId
      } = request.params;
      const {
        from
      } = request.query;
      const resp = await getJobAuditMessages(jobSavedObjectService, jobId, from);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup JobAuditMessages
   *
   * @api {get} /api/ml/job_audit_messages/messages Get all audit messages
   * @apiName GetAllJobAuditMessages
   * @apiDescription Returns all audit messages
   *
   * @apiSchema (query) jobAuditMessagesQuerySchema
   */

  router.get({
    path: '/api/ml/job_audit_messages/messages',
    validate: {
      query: _job_audit_messages_schema.jobAuditMessagesQuerySchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response,
    jobSavedObjectService
  }) => {
    try {
      const {
        getJobAuditMessages
      } = (0, _job_audit_messages.jobAuditMessagesProvider)(client, mlClient);
      const {
        from
      } = request.query;
      const resp = await getJobAuditMessages(jobSavedObjectService, undefined, from);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}