"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mlJobRoute = mlJobRoute;

var _configSchema = require("@kbn/config-schema");

var _get_cluster_stats = require("../../../../lib/cluster/get_cluster_stats");

var _get_cluster_status = require("../../../../lib/cluster/get_cluster_status");

var _get_ml_jobs = require("../../../../lib/elasticsearch/get_ml_jobs");

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


function mlJobRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/ml_jobs',
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
          })
        })
      }
    },

    async handler(req) {
      const config = server.config();
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const esIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_ELASTICSEARCH, ccs);

      try {
        const clusterStats = await (0, _get_cluster_stats.getClusterStats)(req, esIndexPattern, clusterUuid);
        const indicesUnassignedShardStats = await (0, _get_indices_unassigned_shard_stats.getIndicesUnassignedShardStats)(req, esIndexPattern, clusterStats);
        const rows = await (0, _get_ml_jobs.getMlJobs)(req, esIndexPattern);
        return {
          clusterStatus: (0, _get_cluster_status.getClusterStatus)(clusterStats, indicesUnassignedShardStats),
          rows
        };
      } catch (err) {
        throw (0, _handle_error.handleError)(err, req);
      }
    }

  });
}