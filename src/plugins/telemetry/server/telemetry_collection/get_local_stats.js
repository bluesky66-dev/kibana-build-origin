"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleLocalStats = handleLocalStats;
exports.getLocalStats = void 0;

var _get_cluster_info = require("./get_cluster_info");

var _get_cluster_stats = require("./get_cluster_stats");

var _get_kibana = require("./get_kibana");

var _get_nodes_usage = require("./get_nodes_usage");

var _get_data_telemetry = require("./get_data_telemetry");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Handle the separate local calls by combining them into a single object response that looks like the
 * "cluster_stats" document from X-Pack monitoring.
 *
 * @param {Object} server ??
 * @param {Object} clusterInfo Cluster info (GET /)
 * @param {Object} clusterStats Cluster stats (GET /_cluster/stats)
 * @param {Object} kibana The Kibana Usage stats
 */
function handleLocalStats( // eslint-disable-next-line @typescript-eslint/naming-convention
{
  cluster_name,
  cluster_uuid,
  version
}, {
  _nodes,
  cluster_name: clusterName,
  ...clusterStats
}, kibana, dataTelemetry, context) {
  return {
    timestamp: new Date().toISOString(),
    cluster_uuid,
    cluster_name,
    version: version.number,
    cluster_stats: clusterStats,
    collection: 'local',
    stack_stats: {
      [_get_data_telemetry.DATA_TELEMETRY_ID]: dataTelemetry,
      kibana: (0, _get_kibana.handleKibanaStats)(context, kibana)
    }
  };
}

/**
 * Get statistics for all products joined by Elasticsearch cluster.
 * @param {Array} cluster uuids array of cluster uuid's
 * @param {Object} config contains the usageCollection, callCluster (deprecated), the esClient and Saved Objects client scoped to the request or the internal repository, and the kibana request
 * @param {Object} StatsCollectionContext contains logger and version (string)
 */
const getLocalStats = async (clustersDetails, config, context) => {
  const {
    usageCollection,
    esClient,
    soClient,
    kibanaRequest
  } = config;
  return await Promise.all(clustersDetails.map(async clustersDetail => {
    const [clusterInfo, clusterStats, nodesUsage, kibana, dataTelemetry] = await Promise.all([(0, _get_cluster_info.getClusterInfo)(esClient), // cluster info
    (0, _get_cluster_stats.getClusterStats)(esClient), // cluster stats (not to be confused with cluster _state_)
    (0, _get_nodes_usage.getNodesUsage)(esClient), // nodes_usage info
    (0, _get_kibana.getKibana)(usageCollection, esClient, soClient, kibanaRequest), (0, _get_data_telemetry.getDataTelemetry)(esClient)]);
    return handleLocalStats(clusterInfo, { ...clusterStats,
      nodes: { ...clusterStats.nodes,
        usage: nodesUsage
      }
    }, kibana, dataTelemetry, context);
  }));
};

exports.getLocalStats = getLocalStats;