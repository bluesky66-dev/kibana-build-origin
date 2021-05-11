"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodesShardCount = getNodesShardCount;

var _lodash = require("lodash");

var _error_missing_required = require("../../error_missing_required");

var _create_query = require("../../create_query");

var _metrics = require("../../metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getShardCountPerNode(req, esIndexPattern, cluster) {
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
        nodes: {
          terms: {
            field: 'shard.node',
            size: maxBucketSize
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

async function getNodesShardCount(req, esIndexPattern, cluster) {
  (0, _error_missing_required.checkParam)(esIndexPattern, 'esIndexPattern in elasticsearch/getShardStats');
  const response = await getShardCountPerNode(req, esIndexPattern, cluster);
  const nodes = (0, _lodash.get)(response, 'aggregations.nodes.buckets', []).reduce((accum, bucket) => {
    accum[bucket.key] = {
      shardCount: bucket.doc_count
    };
    return accum;
  }, {});
  return {
    nodes
  };
}