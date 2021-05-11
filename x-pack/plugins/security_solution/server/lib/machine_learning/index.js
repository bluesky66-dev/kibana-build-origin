"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Anomaly", {
  enumerable: true,
  get: function () {
    return _server.AnomalyRecordDoc;
  }
});
exports.getAnomalies = void 0;

var _build_exceptions_filter = require("../../../common/detection_engine/build_exceptions_filter");

var _server = require("../../../../ml/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAnomalies = async (params, mlAnomalySearch) => {
  var _buildExceptionFilter;

  const boolCriteria = buildCriteria(params);
  return mlAnomalySearch({
    size: params.maxRecords || 100,
    body: {
      query: {
        bool: {
          filter: [{
            query_string: {
              query: 'result_type:record',
              analyze_wildcard: false
            }
          }, {
            term: {
              is_interim: false
            }
          }, {
            bool: {
              must: boolCriteria
            }
          }],
          must_not: (_buildExceptionFilter = (0, _build_exceptions_filter.buildExceptionFilter)({
            lists: params.exceptionItems,
            excludeExceptions: true,
            chunkSize: 1024
          })) === null || _buildExceptionFilter === void 0 ? void 0 : _buildExceptionFilter.query
        }
      },
      fields: [{
        field: '*',
        include_unmapped: true
      }],
      sort: [{
        record_score: {
          order: 'desc'
        }
      }]
    }
  }, params.jobIds);
};

exports.getAnomalies = getAnomalies;

const buildCriteria = params => {
  const {
    earliestMs,
    jobIds,
    latestMs,
    threshold
  } = params;
  const jobIdsFilterable = jobIds.length > 0 && !(jobIds.length === 1 && jobIds[0] === '*');
  const boolCriteria = [{
    range: {
      timestamp: {
        gte: earliestMs,
        lte: latestMs,
        format: 'epoch_millis'
      }
    }
  }, {
    range: {
      record_score: {
        gte: threshold
      }
    }
  }];

  if (jobIdsFilterable) {
    const jobIdFilter = jobIds.map(jobId => `job_id:${jobId}`).join(' OR ');
    boolCriteria.push({
      query_string: {
        analyze_wildcard: false,
        query: jobIdFilter
      }
    });
  }

  return boolCriteria;
};