"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchClusterHealth = fetchClusterHealth;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function fetchClusterHealth(callCluster, clusters, index) {
  const params = {
    index,
    filterPath: ['hits.hits._source.cluster_state.status', 'hits.hits._source.cluster_uuid', 'hits.hits._index'],
    body: {
      size: clusters.length,
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: {
        bool: {
          filter: [{
            terms: {
              cluster_uuid: clusters.map(cluster => cluster.clusterUuid)
            }
          }, {
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
      collapse: {
        field: 'cluster_uuid'
      }
    }
  };
  const response = await callCluster('search', params);
  return response.hits.hits.map(hit => {
    var _hit$_source$cluster_;

    return {
      health: (_hit$_source$cluster_ = hit._source.cluster_state) === null || _hit$_source$cluster_ === void 0 ? void 0 : _hit$_source$cluster_.status,
      clusterUuid: hit._source.cluster_uuid,
      ccs: hit._index.includes(':') ? hit._index.split(':')[0] : undefined
    };
  });
}