"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esIndexRoute = esIndexRoute;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _get_cluster_stats = require("../../../../lib/cluster/get_cluster_stats");

var _indices = require("../../../../lib/elasticsearch/indices");

var _get_metrics = require("../../../../lib/details/get_metrics");

var _shards = require("../../../../lib/elasticsearch/shards");

var _handle_error = require("../../../../lib/errors/handle_error");

var _ccs_utils = require("../../../../lib/ccs_utils");

var _metric_set_index_detail = require("./metric_set_index_detail");

var _constants = require("../../../../../common/constants");

var _get_logs = require("../../../../lib/logs/get_logs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  advanced: metricSetAdvanced,
  overview: metricSetOverview
} = _metric_set_index_detail.metricSet;

function esIndexRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/indices/{id}',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string(),
          id: _configSchema.schema.string()
        }),
        payload: _configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          timeRange: _configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          }),
          is_advanced: _configSchema.schema.boolean()
        })
      }
    },
    handler: async req => {
      try {
        const config = server.config();
        const ccs = req.payload.ccs;
        const clusterUuid = req.params.clusterUuid;
        const indexUuid = req.params.id;
        const start = req.payload.timeRange.min;
        const end = req.payload.timeRange.max;
        const esIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_ELASTICSEARCH, ccs);
        const filebeatIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, config.get('monitoring.ui.logs.index'), '*');
        const isAdvanced = req.payload.is_advanced;
        const metricSet = isAdvanced ? metricSetAdvanced : metricSetOverview;
        const cluster = await (0, _get_cluster_stats.getClusterStats)(req, esIndexPattern, clusterUuid);
        const showSystemIndices = true; // hardcode to true, because this could be a system index

        const shardStats = await (0, _shards.getShardStats)(req, esIndexPattern, cluster, {
          includeNodes: true,
          includeIndices: true,
          indexName: indexUuid
        });
        const indexSummary = await (0, _indices.getIndexSummary)(req, esIndexPattern, shardStats, {
          clusterUuid,
          indexUuid,
          start,
          end
        });
        const metrics = await (0, _get_metrics.getMetrics)(req, esIndexPattern, metricSet, [{
          term: {
            'index_stats.index': indexUuid
          }
        }]);
        let logs;
        let shardAllocation;

        if (!isAdvanced) {
          // TODO: Why so many fields needed for a single component (shard legend)?
          const shardFilter = {
            term: {
              'shard.index': indexUuid
            }
          };
          const stateUuid = (0, _lodash.get)(cluster, 'cluster_state.state_uuid');
          const allocationOptions = {
            shardFilter,
            stateUuid,
            showSystemIndices
          };
          const shards = await (0, _shards.getShardAllocation)(req, esIndexPattern, allocationOptions);
          logs = await (0, _get_logs.getLogs)(config, req, filebeatIndexPattern, {
            clusterUuid,
            indexUuid,
            start,
            end
          });
          shardAllocation = {
            shards,
            shardStats: {
              nodes: shardStats.nodes
            },
            nodes: shardStats.nodes,
            // for identifying nodes that shard relocates to
            stateUuid // for debugging/troubleshooting

          };
        }

        return {
          indexSummary,
          metrics,
          logs,
          ...shardAllocation
        };
      } catch (err) {
        throw (0, _handle_error.handleError)(err, req);
      }
    }
  });
}