"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobValidationRoutes = jobValidationRoutes;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _error_wrapper = require("../client/error_wrapper");

var _job_validation_schema = require("./schemas/job_validation_schema");

var _bucket_span_estimator = require("../models/bucket_span_estimator");

var _calculate_model_memory_limit = require("../models/calculate_model_memory_limit");

var _job_validation = require("../models/job_validation");

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

/**
 * Routes for job validation
 */


function jobValidationRoutes({
  router,
  mlLicense,
  routeGuard
}, version) {
  function calculateModelMemoryLimit(client, mlClient, payload) {
    const {
      datafeedConfig,
      analysisConfig,
      indexPattern,
      query,
      timeFieldName,
      earliestMs,
      latestMs
    } = payload;
    return (0, _calculate_model_memory_limit.calculateModelMemoryLimitProvider)(client, mlClient)(analysisConfig, indexPattern, query, timeFieldName, earliestMs, latestMs, undefined, datafeedConfig);
  }
  /**
   * @apiGroup JobValidation
   *
   * @api {post} /api/ml/validate/estimate_bucket_span Estimate bucket span
   * @apiName EstimateBucketSpan
   * @apiDescription  Estimates minimum viable bucket span based on the characteristics of a pre-viewed subset of the data
   *
   * @apiSchema (body) estimateBucketSpanSchema
   */


  router.post({
    path: '/api/ml/validate/estimate_bucket_span',
    validate: {
      body: _job_validation_schema.estimateBucketSpanSchema
    },
    options: {
      tags: ['access:ml:canCreateJob']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      let errorResp;
      const resp = await (0, _bucket_span_estimator.estimateBucketSpanFactory)(client)(request.body) // this catch gets triggered when the estimation code runs without error
      // but isn't able to come up with a bucket span estimation.
      // this doesn't return a HTTP error but an object with an error message
      // which the client is then handling. triggering a HTTP error would be
      // too severe for this case.
      .catch(error => {
        errorResp = {
          error: true,
          message: error
        };
      });
      return response.ok({
        body: errorResp !== undefined ? errorResp : resp
      });
    } catch (e) {
      // this catch gets triggered when an actual error gets thrown when running
      // the estimation code, for example when the request payload is malformed
      throw _boom.default.badRequest(e);
    }
  }));
  /**
   * @apiGroup JobValidation
   *
   * @api {post} /api/ml/validate/calculate_model_memory_limit Calculates model memory limit
   * @apiName CalculateModelMemoryLimit
   * @apiDescription Calls _estimate_model_memory endpoint to retrieve model memory estimation.
   *
   * @apiSchema (body) modelMemoryLimitSchema
   *
   * @apiSuccess {String} modelMemoryLimit
   */

  router.post({
    path: '/api/ml/validate/calculate_model_memory_limit',
    validate: {
      body: _job_validation_schema.modelMemoryLimitSchema
    },
    options: {
      tags: ['access:ml:canCreateJob']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const resp = await calculateModelMemoryLimit(client, mlClient, request.body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup JobValidation
   *
   * @api {post} /api/ml/validate/cardinality Validate cardinality
   * @apiName ValidateCardinality
   * @apiDescription Validates cardinality for the given job configuration
   *
   * @apiSchema (body) validateCardinalitySchema
   */

  router.post({
    path: '/api/ml/validate/cardinality',
    validate: {
      body: _job_validation_schema.validateCardinalitySchema
    },
    options: {
      tags: ['access:ml:canCreateJob']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      const resp = await (0, _job_validation.validateCardinality)(client, request.body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup JobValidation
   *
   * @api {post} /api/ml/validate/job Validates job
   * @apiName ValidateJob
   * @apiDescription Validates the given job configuration
   *
   * @apiSchema (body) validateJobSchema
   */

  router.post({
    path: '/api/ml/validate/job',
    validate: {
      body: _job_validation_schema.validateJobSchema
    },
    options: {
      tags: ['access:ml:canCreateJob']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      // version corresponds to the version used in documentation links.
      const resp = await (0, _job_validation.validateJob)(client, mlClient, request.body, version, mlLicense.isSecurityEnabled() === false);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}