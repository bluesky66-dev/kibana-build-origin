"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esNodesRoute = esNodesRoute;

var _configSchema = require("@kbn/config-schema");

var _get_cluster_stats = require("../../../../lib/cluster/get_cluster_stats");

var _get_cluster_status = require("../../../../lib/cluster/get_cluster_status");

var _nodes = require("../../../../lib/elasticsearch/nodes");

var _get_nodes_shard_count = require("../../../../lib/elasticsearch/shards/get_nodes_shard_count");

var _handle_error = require("../../../../lib/errors/handle_error");

var _ccs_utils = require("../../../../lib/ccs_utils");

var _constants = require("../../../../../common/constants");

var _get_paginated_nodes = require("../../../../lib/elasticsearch/nodes/get_nodes/get_paginated_nodes");

var _nodes_listing_metrics = require("../../../../lib/elasticsearch/nodes/get_nodes/nodes_listing_metrics");

var _get_indices_unassigned_shard_stats = require("../../../../lib/elasticsearch/shards/get_indices_unassigned_shard_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function esNodesRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/nodes',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string()
        }),
        payload: _configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          timeRange: _configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          }),
          pagination: _configSchema.schema.object({
            index: _configSchema.schema.number(),
            size: _configSchema.schema.number()
          }),
          sort: _configSchema.schema.object({
            field: _configSchema.schema.string({
              defaultValue: ''
            }),
            direction: _configSchema.schema.string({
              defaultValue: ''
            })
          }),
          queryText: _configSchema.schema.string({
            defaultValue: ''
          })
        })
      }
    },

    async handler(req) {
      const config = server.config();
      const {
        ccs,
        pagination,
        sort,
        queryText
      } = req.payload;
      const clusterUuid = req.params.clusterUuid;
      const esIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_ELASTICSEARCH, ccs);

      try {
        const clusterStats = await (0, _get_cluster_stats.getClusterStats)(req, esIndexPattern, clusterUuid);
        const nodesShardCount = await (0, _get_nodes_shard_count.getNodesShardCount)(req, esIndexPattern, clusterStats);
        const indicesUnassignedShardStats = await (0, _get_indices_unassigned_shard_stats.getIndicesUnassignedShardStats)(req, esIndexPattern, clusterStats);
        const clusterStatus = (0, _get_cluster_status.getClusterStatus)(clusterStats, indicesUnassignedShardStats);
        const metricSet = _nodes_listing_metrics.LISTING_METRICS_NAMES;
        const {
          pageOfNodes,
          totalNodeCount
        } = await (0, _get_paginated_nodes.getPaginatedNodes)(req, esIndexPattern, {
          clusterUuid
        }, metricSet, pagination, sort, queryText, {
          clusterStats,
          nodesShardCount
        });
        const nodes = await (0, _nodes.getNodes)(req, esIndexPattern, pageOfNodes, clusterStats, nodesShardCount);
        return {
          clusterStatus,
          nodes,
          totalNodeCount
        };
      } catch (err) {
        throw (0, _handle_error.handleError)(err, req);
      }
    }

  });
}