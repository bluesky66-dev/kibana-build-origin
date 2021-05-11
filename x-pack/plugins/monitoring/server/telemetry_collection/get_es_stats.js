"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElasticsearchStats = getElasticsearchStats;
exports.fetchElasticsearchStats = fetchElasticsearchStats;
exports.handleElasticsearchStats = handleElasticsearchStats;

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get statistics for all selected Elasticsearch clusters.
 *
 * @param {Object} server The server instance
 * @param {function} callCluster The callWithRequest or callWithInternalUser handler
 * @param {Array} clusterUuids The string Cluster UUIDs to fetch details for
 */


async function getElasticsearchStats(callCluster, clusterUuids, maxBucketSize) {
  const response = await fetchElasticsearchStats(callCluster, clusterUuids, maxBucketSize);
  return handleElasticsearchStats(response);
}
/**
 * Fetch the Elasticsearch stats.
 *
 * @param {Object} server The server instance
 * @param {function} callCluster The callWithRequest or callWithInternalUser handler
 * @param {Array} clusterUuids Cluster UUIDs to limit the request against
 *
 * Returns the response for the aggregations to fetch details for the product.
 */


function fetchElasticsearchStats(callCluster, clusterUuids, maxBucketSize) {
  const params = {
    index: _constants.INDEX_PATTERN_ELASTICSEARCH,
    size: maxBucketSize,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._source.cluster_uuid', 'hits.hits._source.timestamp', 'hits.hits._source.cluster_name', 'hits.hits._source.version', 'hits.hits._source.cluster_stats', 'hits.hits._source.stack_stats'],
    body: {
      query: {
        bool: {
          filter: [
          /*
           * Note: Unlike most places, we don't care about the old _type: cluster_stats because it would NOT
           * have the license in it (that used to be in the .monitoring-data-2 index in cluster_info)
           */
          {
            term: {
              type: 'cluster_stats'
            }
          }, {
            terms: {
              cluster_uuid: clusterUuids
            }
          }]
        }
      },
      collapse: {
        field: 'cluster_uuid'
      },
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }
    }
  };
  return callCluster('search', params);
}
/**
 * Extract the cluster stats for each cluster.
 */


function handleElasticsearchStats(response) {
  var _response$hits;

  const clusters = ((_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) || [];
  return clusters.map(cluster => cluster._source);
}