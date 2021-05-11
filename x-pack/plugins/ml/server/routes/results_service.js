"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resultsServiceRoutes = resultsServiceRoutes;

var _error_wrapper = require("../client/error_wrapper");

var _results_service_schema = require("./schemas/results_service_schema");

var _results_service = require("../models/results_service");

var _anomaly_detectors_schema = require("./schemas/anomaly_detectors_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getAnomaliesTableData(mlClient, payload) {
  const rs = (0, _results_service.resultsServiceProvider)(mlClient);
  const {
    jobIds,
    criteriaFields,
    influencers,
    aggregationInterval,
    threshold,
    earliestMs,
    latestMs,
    dateFormatTz,
    maxRecords,
    maxExamples,
    influencersFilterQuery,
    functionDescription
  } = payload;
  return rs.getAnomaliesTableData(jobIds, criteriaFields, influencers, aggregationInterval, threshold, earliestMs, latestMs, dateFormatTz, maxRecords, maxExamples, influencersFilterQuery, functionDescription);
}

function getCategoryDefinition(mlClient, payload) {
  const rs = (0, _results_service.resultsServiceProvider)(mlClient);
  return rs.getCategoryDefinition(payload.jobId, payload.categoryId);
}

function getCategoryExamples(mlClient, payload) {
  const rs = (0, _results_service.resultsServiceProvider)(mlClient);
  const {
    jobId,
    categoryIds,
    maxExamples
  } = payload;
  return rs.getCategoryExamples(jobId, categoryIds, maxExamples);
}

function getMaxAnomalyScore(mlClient, payload) {
  const rs = (0, _results_service.resultsServiceProvider)(mlClient);
  const {
    jobIds,
    earliestMs,
    latestMs
  } = payload;
  return rs.getMaxAnomalyScore(jobIds, earliestMs, latestMs);
}

function getPartitionFieldsValues(mlClient, payload) {
  const rs = (0, _results_service.resultsServiceProvider)(mlClient);
  const {
    jobId,
    searchTerm,
    criteriaFields,
    earliestMs,
    latestMs,
    fieldsConfig
  } = payload;
  return rs.getPartitionFieldsValues(jobId, searchTerm, criteriaFields, earliestMs, latestMs, fieldsConfig);
}

function getCategorizerStats(mlClient, params, query) {
  const {
    jobId
  } = params;
  const {
    partitionByValue
  } = query;
  const rs = (0, _results_service.resultsServiceProvider)(mlClient);
  return rs.getCategorizerStats(jobId, partitionByValue);
}

function getCategoryStoppedPartitions(mlClient, payload) {
  const {
    jobIds,
    fieldToBucket
  } = payload;
  const rs = (0, _results_service.resultsServiceProvider)(mlClient);
  return rs.getCategoryStoppedPartitions(jobIds, fieldToBucket);
}
/**
 * Routes for results service
 */


function resultsServiceRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup ResultsService
   *
   * @api {post} /api/ml/results/anomalies_table_data Prepare anomalies records for table display
   * @apiName GetAnomaliesTableData
   * @apiDescription Retrieves anomaly records for an anomaly detection job and formats them for anomalies table display
   *
   * @apiSchema (body) anomaliesTableDataSchema
   */
  router.post({
    path: '/api/ml/results/anomalies_table_data',
    validate: {
      body: _results_service_schema.anomaliesTableDataSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const resp = await getAnomaliesTableData(mlClient, request.body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup ResultsService
   *
   * @api {post} /api/ml/results/category_definition Returns category definition
   * @apiName GetCategoryDefinition
   * @apiDescription Returns the definition of the category with the specified ID and job ID
   *
   * @apiSchema (body) categoryDefinitionSchema
   */

  router.post({
    path: '/api/ml/results/category_definition',
    validate: {
      body: _results_service_schema.categoryDefinitionSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const resp = await getCategoryDefinition(mlClient, request.body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup ResultsService
   *
   * @api {post} /api/ml/results/max_anomaly_score Returns the maximum anomaly_score
   * @apiName GetMaxAnomalyScore
   * @apiDescription Returns the maximum anomaly score of the bucket results for the request job ID(s) and time range
   *
   * @apiSchema (body) maxAnomalyScoreSchema
   */

  router.post({
    path: '/api/ml/results/max_anomaly_score',
    validate: {
      body: _results_service_schema.maxAnomalyScoreSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const resp = await getMaxAnomalyScore(mlClient, request.body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup ResultsService
   *
   * @api {post} /api/ml/results/category_examples Returns category examples
   * @apiName GetCategoryExamples
   * @apiDescription Returns examples for the categories with the specified IDs from the job with the supplied ID
   *
   * @apiSchema (body) categoryExamplesSchema
   */

  router.post({
    path: '/api/ml/results/category_examples',
    validate: {
      body: _results_service_schema.categoryExamplesSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const resp = await getCategoryExamples(mlClient, request.body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup ResultsService
   *
   * @api {post} /api/ml/results/partition_fields_values Returns partition fields values
   * @apiName GetPartitionFieldsValues
   * @apiDescription Returns the partition fields with values that match the provided criteria for the specified job ID.
   *
   * @apiSchema (body) partitionFieldValuesSchema
   */

  router.post({
    path: '/api/ml/results/partition_fields_values',
    validate: {
      body: _results_service_schema.partitionFieldValuesSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const resp = await getPartitionFieldsValues(mlClient, request.body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup ResultsService
   *
   * @api {post} /api/ml/results/anomaly_search Performs a search on the anomaly results index
   * @apiName AnomalySearch
   */

  router.post({
    path: '/api/ml/results/anomaly_search',
    validate: {
      body: _results_service_schema.anomalySearchSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        jobIds,
        query
      } = request.body;
      const {
        body
      } = await mlClient.anomalySearch(query, jobIds);
      return response.ok({
        body
      });
    } catch (error) {
      return response.customError((0, _error_wrapper.wrapError)(error));
    }
  }));
  /**
   * @apiGroup ResultsService
   *
   * @api {get} /api/ml/results/:jobId/categorizer_stats
   * @apiName GetCategorizerStats
   * @apiDescription Returns the categorizer stats for the specified job ID
   * @apiSchema (params) jobIdSchema
   * @apiSchema (query) getCategorizerStatsSchema
   */

  router.get({
    path: '/api/ml/results/{jobId}/categorizer_stats',
    validate: {
      params: _anomaly_detectors_schema.jobIdSchema,
      query: _results_service_schema.getCategorizerStatsSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const resp = await getCategorizerStats(mlClient, request.params, request.query);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup ResultsService
   *
   * @api {get} /api/ml/results/category_stopped_partitions
   * @apiName GetCategoryStoppedPartitions
   * @apiDescription Returns information on the partitions that have stopped being categorized due to the categorization status changing from ok to warn. Can return either the list of stopped partitions for each job, or just the list of job IDs.
   * @apiSchema (body) getCategorizerStoppedPartitionsSchema
   */

  router.post({
    path: '/api/ml/results/category_stopped_partitions',
    validate: {
      body: _results_service_schema.getCategorizerStoppedPartitionsSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const resp = await getCategoryStoppedPartitions(mlClient, request.body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}