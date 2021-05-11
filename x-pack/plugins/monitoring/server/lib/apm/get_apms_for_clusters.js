"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getApmsForClusters = getApmsForClusters;

var _error_missing_required = require("../error_missing_required");

var _create_apm_query = require("./create_apm_query");

var _metrics = require("../metrics");

var _apm_stats = require("./_apm_stats");

var _get_time_of_last_event = require("./_get_time_of_last_event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleResponse(clusterUuid, response) {
  const {
    apmTotal,
    totalEvents,
    memRss,
    memTotal
  } = (0, _apm_stats.apmAggResponseHandler)(response); // combine stats

  const stats = {
    totalEvents,
    memRss,
    memTotal,
    apms: {
      total: apmTotal
    }
  };
  return {
    clusterUuid,
    stats
  };
}

function getApmsForClusters(req, apmIndexPattern, clusters) {
  (0, _error_missing_required.checkParam)(apmIndexPattern, 'apmIndexPattern in apms/getApmsForClusters');
  const start = req.payload.timeRange.min;
  const end = req.payload.timeRange.max;
  const config = req.server.config();
  const maxBucketSize = config.get('monitoring.ui.max_bucket_size');
  return Promise.all(clusters.map(async cluster => {
    const clusterUuid = cluster.cluster_uuid;
    const params = {
      index: apmIndexPattern,
      size: 0,
      ignoreUnavailable: true,
      filterPath: _apm_stats.apmAggFilterPath,
      body: {
        query: (0, _create_apm_query.createApmQuery)({
          start,
          end,
          clusterUuid,
          metric: _metrics.ApmMetric.getMetricFields() // override default of BeatMetric.getMetricFields

        }),
        aggs: (0, _apm_stats.apmUuidsAgg)(maxBucketSize)
      }
    };
    const {
      callWithRequest
    } = req.server.plugins.elasticsearch.getCluster('monitoring');
    const [response, timeOfLastEvent] = await Promise.all([callWithRequest(req, 'search', params), (0, _get_time_of_last_event.getTimeOfLastEvent)({
      req,
      callWithRequest,
      apmIndexPattern,
      start,
      end,
      clusterUuid
    })]);
    const formattedResponse = handleResponse(clusterUuid, response);
    return { ...formattedResponse,
      stats: { ...formattedResponse.stats,
        timeOfLastEvent
      }
    };
  }));
}