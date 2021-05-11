"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esIndicesRoute = esIndicesRoute;

var _configSchema = require("@kbn/config-schema");

var _get_cluster_stats = require("../../../../lib/cluster/get_cluster_stats");

var _get_cluster_status = require("../../../../lib/cluster/get_cluster_status");

var _indices = require("../../../../lib/elasticsearch/indices");

var _handle_error = require("../../../../lib/errors/handle_error");

var _ccs_utils = require("../../../../lib/ccs_utils");

var _constants = require("../../../../../common/constants");

var _get_indices_unassigned_shard_stats = require("../../../../lib/elasticsearch/shards/get_indices_unassigned_shard_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function esIndicesRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/indices',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string()
        }),
        query: _configSchema.schema.object({
          show_system_indices: _configSchema.schema.boolean()
        }),
        payload: _configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          timeRange: _configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          })
        })
      }
    },

    async handler(req) {
      const config = server.config();
      const {
        clusterUuid
      } = req.params;
      const {
        show_system_indices: showSystemIndices
      } = req.query;
      const {
        ccs
      } = req.payload;
      const esIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_ELASTICSEARCH, ccs);

      try {
        const clusterStats = await (0, _get_cluster_stats.getClusterStats)(req, esIndexPattern, clusterUuid);
        const indicesUnassignedShardStats = await (0, _get_indices_unassigned_shard_stats.getIndicesUnassignedShardStats)(req, esIndexPattern, clusterStats);
        const indices = await (0, _indices.getIndices)(req, esIndexPattern, showSystemIndices, indicesUnassignedShardStats);
        return {
          clusterStatus: (0, _get_cluster_status.getClusterStatus)(clusterStats, indicesUnassignedShardStats),
          indices
        };
      } catch (err) {
        throw (0, _handle_error.handleError)(err, req);
      }
    }

  });
}