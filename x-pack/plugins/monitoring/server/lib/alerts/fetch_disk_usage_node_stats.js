"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDiskUsageNodeStats = fetchDiskUsageNodeStats;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchDiskUsageNodeStats(callCluster, clusters, index, duration, size) {
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
            size,
            include: clustersIds
          },
          aggs: {
            nodes: {
              terms: {
                field: 'node_stats.node_id',
                size
              },
              aggs: {
                index: {
                  terms: {
                    field: '_index',
                    size: 1
                  }
                },
                total_in_bytes: {
                  max: {
                    field: 'node_stats.fs.total.total_in_bytes'
                  }
                },
                available_in_bytes: {
                  max: {
                    field: 'node_stats.fs.total.available_in_bytes'
                  }
                },
                usage_ratio_percentile: {
                  bucket_script: {
                    buckets_path: {
                      available_in_bytes: 'available_in_bytes',
                      total_in_bytes: 'total_in_bytes'
                    },
                    script: '100 - Math.floor((params.available_in_bytes / params.total_in_bytes) * 100)'
                  }
                },
                name: {
                  terms: {
                    field: 'source_node.name',
                    size: 1
                  }
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
      const indexName = (0, _lodash.get)(node, 'index.buckets[0].key', '');
      const diskUsage = Number((0, _lodash.get)(node, 'usage_ratio_percentile.value'));

      if (isNaN(diskUsage) || diskUsage === undefined || diskUsage === null) {
        continue;
      }

      stats.push({
        diskUsage,
        clusterUuid: clusterBucket.key,
        nodeId: node.key,
        nodeName: (0, _lodash.get)(node, 'name.buckets[0].key'),
        ccs: indexName.includes(':') ? indexName.split(':')[0] : null
      });
    }
  }

  return stats;
}