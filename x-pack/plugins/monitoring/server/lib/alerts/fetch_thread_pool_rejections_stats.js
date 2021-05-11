"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchThreadPoolRejectionStats = fetchThreadPoolRejectionStats;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const invalidNumberValue = value => {
  return isNaN(value) || value === undefined || value === null;
};

const getTopHits = (threadType, order) => ({
  top_hits: {
    sort: [{
      timestamp: {
        order,
        unmapped_type: 'long'
      }
    }],
    _source: {
      includes: [`node_stats.thread_pool.${threadType}.rejected`, 'source_node.name']
    },
    size: 1
  }
});

async function fetchThreadPoolRejectionStats(callCluster, clusters, index, size, threadType, duration) {
  const clustersIds = clusters.map(cluster => cluster.clusterUuid);
  const params = {
    index,
    filterPath: ['aggregations'],
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            terms: {
              cluster_uuid: clustersIds
            }
          }, {
            term: {
              type: 'node_stats'
            }
          }, {
            range: {
              timestamp: {
                gte: `now-${duration}`
              }
            }
          }]
        }
      },
      aggs: {
        clusters: {
          terms: {
            field: 'cluster_uuid',
            size
          },
          aggs: {
            nodes: {
              terms: {
                field: 'source_node.uuid',
                size
              },
              aggs: {
                most_recent: { ...getTopHits(threadType, 'desc')
                },
                least_recent: { ...getTopHits(threadType, 'asc')
                }
              }
            }
          }
        }
      }
    }
  };
  const response = await callCluster('search', params);
  const stats = [];
  const {
    buckets: clusterBuckets = []
  } = response.aggregations.clusters;

  if (!clusterBuckets.length) {
    return stats;
  }

  for (const clusterBucket of clusterBuckets) {
    for (const node of clusterBucket.nodes.buckets) {
      const mostRecentDoc = (0, _lodash.get)(node, 'most_recent.hits.hits[0]');
      mostRecentDoc.timestamp = mostRecentDoc.sort[0];
      const leastRecentDoc = (0, _lodash.get)(node, 'least_recent.hits.hits[0]');
      leastRecentDoc.timestamp = leastRecentDoc.sort[0];

      if (!mostRecentDoc || mostRecentDoc.timestamp === leastRecentDoc.timestamp) {
        continue;
      }

      const rejectedPath = `_source.node_stats.thread_pool.${threadType}.rejected`;
      const newRejectionCount = Number((0, _lodash.get)(mostRecentDoc, rejectedPath));
      const oldRejectionCount = Number((0, _lodash.get)(leastRecentDoc, rejectedPath));

      if (invalidNumberValue(newRejectionCount) || invalidNumberValue(oldRejectionCount)) {
        continue;
      }

      const rejectionCount = oldRejectionCount > newRejectionCount ? newRejectionCount : newRejectionCount - oldRejectionCount;
      const indexName = mostRecentDoc._index;
      const nodeName = (0, _lodash.get)(mostRecentDoc, '_source.source_node.name') || node.key;
      const nodeStat = {
        rejectionCount,
        type: threadType,
        clusterUuid: clusterBucket.key,
        nodeId: node.key,
        nodeName,
        ccs: indexName.includes(':') ? indexName.split(':')[0] : null
      };
      stats.push(nodeStat);
    }
  }

  return stats;
}