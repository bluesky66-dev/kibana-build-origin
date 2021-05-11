"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getShardStats = getShardStats;

var _lodash = require("lodash");

var _error_missing_required = require("../../error_missing_required");

var _create_query = require("../../create_query");

var _metrics = require("../../metrics");

var _normalize_shard_objects = require("./normalize_shard_objects");

var _get_shard_stat_aggs = require("./get_shard_stat_aggs");

var _calculate_shard_stat_indices_totals = require("./calculate_shard_stat_indices_totals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleResponse(resp, includeNodes, includeIndices, cluster) {
  let indices;
  let indicesTotals;
  let nodes;
  const buckets = (0, _lodash.get)(resp, 'aggregations.indices.buckets');

  if (buckets && buckets.length !== 0) {
    indices = buckets.reduce(_normalize_shard_objects.normalizeIndexShards, {});
    indicesTotals = (0, _calculate_shard_stat_indices_totals.calculateIndicesTotals)(indices);
  }

  if (includeNodes) {
    const masterNode = (0, _lodash.get)(cluster, 'cluster_state.master_node');
    nodes = resp.aggregations.nodes.buckets.reduce((0, _normalize_shard_objects.normalizeNodeShards)(masterNode), {});
  }

  return {
    indicesTotals,
    indices: includeIndices ? indices : undefined,
    nodes
  };
}

function getShardStats(req, esIndexPattern, cluster, {
  includeNodes = false,
  includeIndices = false,
  indexName = null,
  nodeUuid = null
} = {}) {
  (0, _error_missing_required.checkParam)(esIndexPattern, 'esIndexPattern in elasticsearch/getShardStats');
  const config = req.server.config();

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const filters = [{
    term: {
      state_uuid: (0, _lodash.get)(cluster, 'cluster_state.state_uuid')
    }
  }];

  if (indexName) {
    filters.push({
      term: {
        'shard.index': indexName
      }
    });
  }

  if (nodeUuid) {
    filters.push({
      term: {
        'shard.node': nodeUuid
      }
    });
  }

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
        filters
      }),
      aggs: { ...(0, _get_shard_stat_aggs.getShardAggs)(config, includeNodes, includeIndices)
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(resp => {
    return handleResponse(resp, includeNodes, includeIndices, cluster);
  });
}