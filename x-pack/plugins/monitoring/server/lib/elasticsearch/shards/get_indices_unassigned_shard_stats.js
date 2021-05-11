"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndicesUnassignedShardStats = getIndicesUnassignedShardStats;

var _lodash = require("lodash");

var _error_missing_required = require("../../error_missing_required");

var _create_query = require("../../create_query");

var _metrics = require("../../metrics");

var _calculate_shard_stat_indices_totals = require("./calculate_shard_stat_indices_totals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getUnassignedShardData(req, esIndexPattern, cluster) {
  const config = req.server.config();
  const maxBucketSize = config.get('monitoring.ui.max_bucket_size');

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const params = {
    index: esIndexPattern,
    size: 0,
    ignoreUnavailable: true,
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_query.createQuery)({
        type: 'shards',
        clusterUuid: cluster.cluster_uuid,
        metric,
        filters: [{
          term: {
            state_uuid: (0, _lodash.get)(cluster, 'cluster_state.state_uuid')
          }
        }]
      }),
      aggs: {
        indices: {
          terms: {
            field: 'shard.index',
            size: maxBucketSize
          },
          aggs: {
            state: {
              filter: {
                terms: {
                  'shard.state': ['UNASSIGNED', 'INITIALIZING']
                }
              },
              aggs: {
                primary: {
                  terms: {
                    field: 'shard.primary',
                    size: 2
                  }
                }
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
  return await callWithRequest(req, 'search', params);
}

async function getIndicesUnassignedShardStats(req, esIndexPattern, cluster) {
  (0, _error_missing_required.checkParam)(esIndexPattern, 'esIndexPattern in elasticsearch/getShardStats');
  const response = await getUnassignedShardData(req, esIndexPattern, cluster);
  const indices = (0, _lodash.get)(response, 'aggregations.indices.buckets', []).reduce((accum, bucket) => {
    const index = bucket.key;
    const states = (0, _lodash.get)(bucket, 'state.primary.buckets', []);
    const unassignedReplica = states.filter(state => state.key_as_string === 'false').reduce((total, state) => total + state.doc_count, 0);
    const unassignedPrimary = states.filter(state => state.key_as_string === 'true').reduce((total, state) => total + state.doc_count, 0);
    let status = 'green';

    if (unassignedReplica > 0) {
      status = 'yellow';
    }

    if (unassignedPrimary > 0) {
      status = 'red';
    }

    accum[index] = {
      unassigned: {
        primary: unassignedPrimary,
        replica: unassignedReplica
      },
      status
    };
    return accum;
  }, {});
  const indicesTotals = (0, _calculate_shard_stat_indices_totals.calculateIndicesTotals)(indices);
  return {
    indices,
    indicesTotals
  };
}