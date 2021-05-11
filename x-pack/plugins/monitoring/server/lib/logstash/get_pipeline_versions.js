"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._handleResponse = _handleResponse;
exports.getPipelineVersions = getPipelineVersions;

var _create_query = require("../create_query");

var _metrics = require("../metrics");

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function fetchPipelineVersions(...args) {
  const [req, config, logstashIndexPattern, clusterUuid, pipelineId] = args;
  (0, _error_missing_required.checkParam)(logstashIndexPattern, 'logstashIndexPattern in getPipelineVersions');
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const filters = [{
    nested: {
      path: 'logstash_stats.pipelines',
      query: {
        bool: {
          filter: [{
            term: {
              'logstash_stats.pipelines.id': pipelineId
            }
          }]
        }
      }
    }
  }];
  const query = (0, _create_query.createQuery)({
    type: 'logstash_stats',
    metric: _metrics.LogstashMetric.getMetricFields(),
    clusterUuid,
    filters
  });
  const filteredAggs = {
    by_pipeline_hash: {
      terms: {
        field: 'logstash_stats.pipelines.hash',
        size: config.get('monitoring.ui.max_bucket_size'),
        order: {
          'path_to_root>first_seen': 'desc'
        }
      },
      aggs: {
        path_to_root: {
          reverse_nested: {},
          aggs: {
            first_seen: {
              min: {
                field: 'logstash_stats.timestamp'
              }
            },
            last_seen: {
              max: {
                field: 'logstash_stats.timestamp'
              }
            }
          }
        }
      }
    }
  };
  const aggs = {
    pipelines: {
      nested: {
        path: 'logstash_stats.pipelines'
      },
      aggs: {
        scoped: {
          filter: {
            bool: {
              filter: [{
                term: {
                  'logstash_stats.pipelines.id': pipelineId
                }
              }]
            }
          },
          aggs: filteredAggs
        }
      }
    }
  };
  const params = {
    index: logstashIndexPattern,
    size: 0,
    ignoreUnavailable: true,
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query,
      aggs
    }
  };
  return callWithRequest(req, 'search', params);
}

function _handleResponse(response) {
  const pipelineHashes = (0, _lodash.get)(response, 'aggregations.pipelines.scoped.by_pipeline_hash.buckets', []);
  return pipelineHashes.map(pipelineHash => ({
    hash: pipelineHash.key,
    firstSeen: (0, _lodash.get)(pipelineHash, 'path_to_root.first_seen.value'),
    lastSeen: (0, _lodash.get)(pipelineHash, 'path_to_root.last_seen.value')
  }));
}

async function getPipelineVersions(...args) {
  const response = await fetchPipelineVersions(...args);
  return _handleResponse(response);
}