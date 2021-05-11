"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClusterUuids = getClusterUuids;
exports.fetchClusterUuids = fetchClusterUuids;
exports.handleClusterUuidsResponse = handleClusterUuidsResponse;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _create_query = require("./create_query");

var _constants = require("../../common/constants");

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
 * Get a list of Cluster UUIDs that exist within the specified timespan.
 */


async function getClusterUuids(callCluster, // TODO: To be changed to the new ES client when the plugin migrates
timestamp, maxBucketSize) {
  const response = await fetchClusterUuids(callCluster, timestamp, maxBucketSize);
  return handleClusterUuidsResponse(response);
}
/**
 * Fetch the aggregated Cluster UUIDs from the monitoring cluster.
 */


async function fetchClusterUuids(callCluster, timestamp, maxBucketSize) {
  const start = (0, _moment.default)(timestamp).subtract(_constants.CLUSTER_DETAILS_FETCH_INTERVAL, 'ms').toISOString();
  const end = (0, _moment.default)(timestamp).toISOString();
  const params = {
    index: _constants.INDEX_PATTERN_ELASTICSEARCH,
    size: 0,
    ignoreUnavailable: true,
    filterPath: 'aggregations.cluster_uuids.buckets.key',
    body: {
      query: (0, _create_query.createQuery)({
        type: 'cluster_stats',
        start,
        end
      }),
      aggs: {
        cluster_uuids: {
          terms: {
            field: 'cluster_uuid',
            size: maxBucketSize
          }
        }
      }
    }
  };
  return await callCluster('search', params);
}
/**
 * Convert the aggregation response into an array of Cluster UUIDs.
 *
 * @param {Object} response The aggregation response
 * @return {Array} Strings; each representing a Cluster's UUID.
 */


function handleClusterUuidsResponse(response) {
  const uuidBuckets = (0, _lodash.get)(response, 'aggregations.cluster_uuids.buckets', []);
  return uuidBuckets.map(uuidBucket => uuidBucket.key);
}