"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanasForClusters = getKibanasForClusters;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_query = require("../create_query.js");

var _metrics = require("../metrics");

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

/*
 * Get high-level info for Kibanas in a set of clusters
 * The set contains multiple clusters for cluster listing page
 * The set contains single cluster for cluster overview page and cluster status bar

 * Timespan for the data is an interval of time based on calculations of an
 * interval size using the same calculation as determining bucketSize using
 * the timepicker for a chart

 * Returns, for each cluster,
 *  - number of instances
 *  - combined health
 */


function getKibanasForClusters(req, kbnIndexPattern, clusters) {
  (0, _error_missing_required.checkParam)(kbnIndexPattern, 'kbnIndexPattern in kibana/getKibanasForClusters');
  const config = req.server.config();
  const start = req.payload.timeRange.min;
  const end = req.payload.timeRange.max;
  return _bluebird.default.map(clusters, cluster => {
    const clusterUuid = cluster.cluster_uuid;

    const metric = _metrics.KibanaClusterMetric.getMetricFields();

    const params = {
      index: kbnIndexPattern,
      size: 0,
      ignoreUnavailable: true,
      body: {
        query: (0, _create_query.createQuery)({
          type: 'kibana_stats',
          start,
          end,
          clusterUuid,
          metric
        }),
        aggs: {
          kibana_uuids: {
            terms: {
              field: 'kibana_stats.kibana.uuid',
              size: config.get('monitoring.ui.max_bucket_size')
            },
            aggs: {
              latest_report: {
                terms: {
                  field: 'kibana_stats.timestamp',
                  size: 1,
                  order: {
                    _key: 'desc'
                  }
                },
                aggs: {
                  response_time_max: {
                    max: {
                      field: 'kibana_stats.response_times.max'
                    }
                  },
                  memory_rss: {
                    max: {
                      field: 'kibana_stats.process.memory.resident_set_size_in_bytes'
                    }
                  },
                  memory_heap_size_limit: {
                    max: {
                      field: 'kibana_stats.process.memory.heap.size_limit'
                    }
                  },
                  concurrent_connections: {
                    max: {
                      field: 'kibana_stats.concurrent_connections'
                    }
                  },
                  requests_total: {
                    max: {
                      field: 'kibana_stats.requests.total'
                    }
                  }
                }
              },
              response_time_max_per: {
                max_bucket: {
                  buckets_path: 'latest_report>response_time_max'
                }
              },
              memory_rss_per: {
                max_bucket: {
                  buckets_path: 'latest_report>memory_rss'
                }
              },
              memory_heap_size_limit_per: {
                max_bucket: {
                  buckets_path: 'latest_report>memory_heap_size_limit'
                }
              },
              concurrent_connections_per: {
                max_bucket: {
                  buckets_path: 'latest_report>concurrent_connections'
                }
              },
              requests_total_per: {
                max_bucket: {
                  buckets_path: 'latest_report>requests_total'
                }
              }
            }
          },
          response_time_max: {
            max_bucket: {
              buckets_path: 'kibana_uuids>response_time_max_per'
            }
          },
          memory_rss: {
            sum_bucket: {
              buckets_path: 'kibana_uuids>memory_rss_per'
            }
          },
          memory_heap_size_limit: {
            sum_bucket: {
              buckets_path: 'kibana_uuids>memory_heap_size_limit_per'
            }
          },
          concurrent_connections: {
            sum_bucket: {
              buckets_path: 'kibana_uuids>concurrent_connections_per'
            }
          },
          requests_total: {
            sum_bucket: {
              buckets_path: 'kibana_uuids>requests_total_per'
            }
          },
          status: {
            terms: {
              field: 'kibana_stats.kibana.status',
              order: {
                max_timestamp: 'desc'
              }
            },
            aggs: {
              max_timestamp: {
                max: {
                  field: 'timestamp'
                }
              }
            }
          }
        }
      }
    };
    const {
      callWithRequest
    } = req.server.plugins.elasticsearch.getCluster('monitoring');
    return callWithRequest(req, 'search', params).then(result => {
      const aggregations = (0, _lodash.get)(result, 'aggregations', {});
      const kibanaUuids = (0, _lodash.get)(aggregations, 'kibana_uuids.buckets', []);
      const statusBuckets = (0, _lodash.get)(aggregations, 'status.buckets', []); // everything is initialized such that it won't impact any rollup

      let status = null;
      let requestsTotal = 0;
      let connections = 0;
      let responseTime = 0;
      let memorySize = 0;
      let memoryLimit = 0; // if the cluster has kibana instances at all

      if (kibanaUuids.length) {
        // get instance status by finding the latest status bucket
        const latestTimestamp = (0, _lodash.chain)(statusBuckets).map(bucket => bucket.max_timestamp.value).max().value();
        const latestBucket = (0, _lodash.find)(statusBuckets, bucket => bucket.max_timestamp.value === latestTimestamp);
        status = (0, _lodash.get)(latestBucket, 'key');
        requestsTotal = (0, _lodash.get)(aggregations, 'requests_total.value');
        connections = (0, _lodash.get)(aggregations, 'concurrent_connections.value');
        responseTime = (0, _lodash.get)(aggregations, 'response_time_max.value');
        memorySize = (0, _lodash.get)(aggregations, 'memory_rss.value'); // resident set size

        memoryLimit = (0, _lodash.get)(aggregations, 'memory_heap_size_limit.value'); // max old space
      }

      return {
        clusterUuid,
        stats: {
          uuids: (0, _lodash.get)(aggregations, 'kibana_uuids.buckets', []).map(({
            key
          }) => key),
          status,
          requests_total: requestsTotal,
          concurrent_connections: connections,
          response_time_max: responseTime,
          memory_size: memorySize,
          memory_limit: memoryLimit,
          count: kibanaUuids.length
        }
      };
    });
  });
}