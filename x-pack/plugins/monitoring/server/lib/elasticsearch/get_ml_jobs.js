"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getMlJobs = getMlJobs;
exports.getMlJobsForCluster = getMlJobsForCluster;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_query = require("../create_query");

var _metrics = require("../metrics");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore

/*
 * Get a listing of jobs along with some metric data to use for the listing
 */


function handleResponse(response) {
  var _response$hits, _hits$map;

  const hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits;
  return (_hits$map = hits === null || hits === void 0 ? void 0 : hits.map(hit => hit._source.job_stats)) !== null && _hits$map !== void 0 ? _hits$map : [];
}

function getMlJobs(req, esIndexPattern) {
  (0, _error_missing_required.checkParam)(esIndexPattern, 'esIndexPattern in getMlJobs');
  const config = req.server.config();
  const maxBucketSize = config.get('monitoring.ui.max_bucket_size');
  const start = req.payload.timeRange.min; // no wrapping in moment :)

  const end = req.payload.timeRange.max;
  const clusterUuid = req.params.clusterUuid;

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const params = {
    index: esIndexPattern,
    size: maxBucketSize,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._source.job_stats.job_id', 'hits.hits._source.job_stats.state', 'hits.hits._source.job_stats.data_counts.processed_record_count', 'hits.hits._source.job_stats.model_size_stats.model_bytes', 'hits.hits._source.job_stats.forecasts_stats.total', 'hits.hits._source.job_stats.node.id', 'hits.hits._source.job_stats.node.name'],
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      collapse: {
        field: 'job_stats.job_id'
      },
      query: (0, _create_query.createQuery)({
        type: 'job_stats',
        start,
        end,
        clusterUuid,
        metric
      })
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse);
}
/*
 * cardinality isn't guaranteed to be accurate is the issue
 * but it will be as long as the precision threshold is >= the actual value
 */


function getMlJobsForCluster(req, esIndexPattern, cluster) {
  var _cluster$license;

  const license = (_cluster$license = cluster.license) !== null && _cluster$license !== void 0 ? _cluster$license : {};

  if (license.status === 'active' && (0, _lodash.includes)(_constants.ML_SUPPORTED_LICENSES, license.type)) {
    // ML is supported
    const start = req.payload.timeRange.min; // no wrapping in moment :)

    const end = req.payload.timeRange.max;
    const clusterUuid = req.params.clusterUuid;

    const metric = _metrics.ElasticsearchMetric.getMetricFields();

    const params = {
      index: esIndexPattern,
      size: 0,
      ignoreUnavailable: true,
      filterPath: 'aggregations.jobs_count.value',
      body: {
        query: (0, _create_query.createQuery)({
          type: 'job_stats',
          start,
          end,
          clusterUuid,
          metric
        }),
        aggs: {
          jobs_count: {
            cardinality: {
              field: 'job_stats.job_id'
            }
          }
        }
      }
    };
    const {
      callWithRequest
    } = req.server.plugins.elasticsearch.getCluster('monitoring');
    return callWithRequest(req, 'search', params).then(response => {
      var _response$aggregation;

      return (_response$aggregation = response.aggregations.jobs_count.value) !== null && _response$aggregation !== void 0 ? _response$aggregation : 0;
    });
  } // ML is not supported


  return Promise.resolve(null);
}