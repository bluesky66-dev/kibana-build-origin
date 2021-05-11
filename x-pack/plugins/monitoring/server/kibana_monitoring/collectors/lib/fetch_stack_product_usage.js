"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchStackProductUsage = fetchStackProductUsage;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchStackProductUsage(config, callCluster, clusterUuid, index, type, uuidPath, filters = []) {
  const size = config.ui.max_bucket_size;
  const params = {
    index,
    size: 0,
    ignoreUnavailable: true,
    filterPath: ['aggregations.uuids.buckets'],
    body: {
      query: {
        bool: {
          must: [{
            term: {
              type: {
                value: type
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
          }, ...filters]
        }
      },
      aggs: {
        uuids: {
          terms: {
            field: uuidPath,
            size
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
      }
    }
  };
  const response = await callCluster('search', params);
  const uuidBuckets = (0, _lodash.get)(response, 'aggregations.uuids.buckets', []);
  const count = uuidBuckets.length;
  const metricbeatUsed = Boolean(uuidBuckets.find(uuidBucket => (0, _lodash.get)(uuidBucket, 'indices.buckets', []).find(indexBucket => indexBucket.key.includes('-mb-'))));
  return {
    count,
    enabled: count > 0,
    metricbeatUsed
  };
}