"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchLogstashVersions = fetchLogstashVersions;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchLogstashVersions(callCluster, clusters, index, size) {
  const params = {
    index,
    filterPath: ['aggregations'],
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            terms: {
              cluster_uuid: clusters.map(cluster => cluster.clusterUuid)
            }
          }, {
            term: {
              type: 'logstash_stats'
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
        index: {
          terms: {
            field: '_index',
            size: 1
          }
        },
        cluster: {
          terms: {
            field: 'cluster_uuid',
            size: 1
          },
          aggs: {
            group_by_logstash: {
              terms: {
                field: 'logstash_stats.logstash.uuid',
                size
              },
              aggs: {
                group_by_version: {
                  terms: {
                    field: 'logstash_stats.logstash.version',
                    size: 1,
                    order: {
                      latest_report: 'desc'
                    }
                  },
                  aggs: {
                    latest_report: {
                      max: {
                        field: 'timestamp'
                      }
                    }
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
  const indexName = (0, _lodash.get)(response, 'aggregations.index.buckets[0].key', '');
  const clusterList = (0, _lodash.get)(response, 'aggregations.cluster.buckets', []);
  return clusterList.map(cluster => {
    const clusterUuid = cluster.key;
    const uuids = (0, _lodash.get)(cluster, 'group_by_logstash.buckets', []);
    const byVersion = {};

    for (const uuid of uuids) {
      const version = (0, _lodash.get)(uuid, 'group_by_version.buckets[0].key', '');

      if (!version) {
        continue;
      }

      byVersion[version] = true;
    }

    return {
      versions: Object.keys(byVersion),
      clusterUuid,
      ccs: indexName.includes(':') ? indexName.split(':')[0] : null
    };
  });
}