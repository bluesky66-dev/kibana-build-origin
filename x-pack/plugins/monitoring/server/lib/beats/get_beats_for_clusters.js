"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getBeatsForClusters = getBeatsForClusters;

var _error_missing_required = require("../error_missing_required");

var _metrics = require("../metrics");

var _create_beats_query = require("./create_beats_query");

var _beats_stats = require("./_beats_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleResponse(clusterUuid, response) {
  const {
    beatTotal,
    beatTypes,
    totalEvents,
    bytesSent
  } = (0, _beats_stats.beatsAggResponseHandler)(response); // combine stats

  const stats = {
    totalEvents,
    bytesSent,
    beats: {
      total: beatTotal,
      types: beatTypes
    }
  };
  return {
    clusterUuid,
    stats
  };
}

function getBeatsForClusters(req, beatsIndexPattern, clusters) {
  (0, _error_missing_required.checkParam)(beatsIndexPattern, 'beatsIndexPattern in beats/getBeatsForClusters');
  const start = req.payload.timeRange.min;
  const end = req.payload.timeRange.max;
  const config = req.server.config();
  const maxBucketSize = config.get('monitoring.ui.max_bucket_size');
  return Promise.all(clusters.map(async cluster => {
    const clusterUuid = cluster.cluster_uuid;
    const params = {
      index: beatsIndexPattern,
      size: 0,
      ignoreUnavailable: true,
      filterPath: _beats_stats.beatsAggFilterPath,
      body: {
        query: (0, _create_beats_query.createBeatsQuery)({
          start,
          end,
          clusterUuid,
          metric: _metrics.BeatsClusterMetric.getMetricFields() // override default of BeatMetric.getMetricFields

        }),
        aggs: (0, _beats_stats.beatsUuidsAgg)(maxBucketSize)
      }
    };
    const {
      callWithRequest
    } = req.server.plugins.elasticsearch.getCluster('monitoring');
    const response = await callWithRequest(req, 'search', params);
    return handleResponse(clusterUuid, response);
  }));
}