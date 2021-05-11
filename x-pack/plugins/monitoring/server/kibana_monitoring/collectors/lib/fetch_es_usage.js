"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchESUsage = fetchESUsage;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchESUsage(config, callCluster, clusterUuid, index) {
  const params = {
    index,
    size: 1,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._source.cluster_stats.nodes.count.total', 'aggregations.indices.buckets'],
    body: {
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: {
        bool: {
          must: [{
            term: {
              type: {
                value: 'cluster_stats'
              }
            }
          }, {
            term: {
              cluster_uuid: {
                value: clusterUuid
              }
            }
          }, {
            range: {
              timestamp: {
                gte: 'now-1h'
              }
            }
          }]
        }
      },
      aggs: {
        indices: {
          terms: {
            field: '_index',
            size: 2
          }
        }
      }
    }
  };
  const response = await callCluster('search', params);
  const esResponse = response;

  if (esResponse.hits.hits.length === 0) {
    return {
      count: 0,
      enabled: false,
      metricbeatUsed: false
    };
  }

  const hit = esResponse.hits.hits[0]._source;
  const count = hit.cluster_stats.nodes.count.total;
  const buckets = (0, _lodash.get)(esResponse, 'aggregations.indices.buckets', []);
  const metricbeatUsed = Boolean(buckets.find(indexBucket => indexBucket.key.includes('-mb-')));
  return {
    count,
    enabled: true,
    metricbeatUsed
  };
}