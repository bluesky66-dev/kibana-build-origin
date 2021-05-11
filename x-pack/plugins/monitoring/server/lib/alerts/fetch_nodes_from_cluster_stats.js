"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchNodesFromClusterStats = fetchNodesFromClusterStats;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function formatNode(nodes) {
  if (!nodes) {
    return [];
  }

  return Object.keys(nodes).map(nodeUuid => {
    return {
      nodeUuid,
      nodeEphemeralId: nodes[nodeUuid].ephemeral_id,
      nodeName: nodes[nodeUuid].name
    };
  });
}

async function fetchNodesFromClusterStats(callCluster, clusters, index) {
  const params = {
    index,
    filterPath: ['aggregations.clusters.buckets'],
    body: {
      size: 0,
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: {
        bool: {
          filter: [{
            term: {
              type: 'cluster_stats'
            }
          }, {
            range: {
              timestamp: {
                gte: 'now-2m'
              }
            }
          }]
        }
      },
      aggs: {
        clusters: {
          terms: {
            include: clusters.map(cluster => cluster.clusterUuid),
            field: 'cluster_uuid'
          },
          aggs: {
            top: {
              top_hits: {
                sort: [{
                  timestamp: {
                    order: 'desc',
                    unmapped_type: 'long'
                  }
                }],
                _source: {
                  includes: ['cluster_state.nodes_hash', 'cluster_state.nodes']
                },
                size: 2
              }
            }
          }
        }
      }
    }
  };
  const response = await callCluster('search', params);
  const nodes = [];
  const clusterBuckets = response.aggregations.clusters.buckets;

  for (const clusterBucket of clusterBuckets) {
    var _hits$0$_source$clust, _hits$1$_source$clust;

    const clusterUuid = clusterBucket.key;
    const hits = clusterBucket.top.hits.hits;
    const indexName = hits[0]._index;
    nodes.push({
      clusterUuid,
      recentNodes: formatNode((_hits$0$_source$clust = hits[0]._source.cluster_state) === null || _hits$0$_source$clust === void 0 ? void 0 : _hits$0$_source$clust.nodes),
      priorNodes: formatNode((_hits$1$_source$clust = hits[1]._source.cluster_state) === null || _hits$1$_source$clust === void 0 ? void 0 : _hits$1$_source$clust.nodes),
      ccs: indexName.includes(':') ? indexName.split(':')[0] : undefined
    });
  }

  return nodes;
}