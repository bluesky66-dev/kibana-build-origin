"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllStats = getAllStats;
exports.handleAllStats = handleAllStats;
exports.getStackStats = getStackStats;
exports.mergeXPackStats = mergeXPackStats;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../common/constants");

var _get_es_stats = require("./get_es_stats");

var _get_kibana_stats = require("./get_kibana_stats");

var _get_beats_stats = require("./get_beats_stats");

var _get_logstash_stats = require("./get_logstash_stats");

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

/**
 * Get statistics for all products joined by Elasticsearch cluster.
 * Returns the array of clusters joined with the Kibana and Logstash instances.
 *
 */


async function getAllStats(clusterUuids, callCluster, // TODO: To be changed to the new ES client when the plugin migrates
timestamp, maxBucketSize) {
  const start = (0, _moment.default)(timestamp).subtract(_constants.USAGE_FETCH_INTERVAL, 'ms').toISOString();
  const end = (0, _moment.default)(timestamp).toISOString();
  const [esClusters, kibana, logstash, beats] = await Promise.all([(0, _get_es_stats.getElasticsearchStats)(callCluster, clusterUuids, maxBucketSize), // cluster_stats, stack_stats.xpack, cluster_name/uuid, license, version
  (0, _get_kibana_stats.getKibanaStats)(callCluster, clusterUuids, start, end, maxBucketSize), // stack_stats.kibana
  (0, _get_logstash_stats.getLogstashStats)(callCluster, clusterUuids), // stack_stats.logstash
  (0, _get_beats_stats.getBeatsStats)(callCluster, clusterUuids, start, end) // stack_stats.beats
  ]);
  return handleAllStats(esClusters, {
    kibana,
    logstash,
    beats
  });
}
/**
 * Combine the statistics from the stack to create "cluster" stats that associate all products together based on the cluster
 * that is attached.
 *
 * @param {Array} clusters The Elasticsearch clusters
 * @param {Object} kibana The Kibana instances keyed by Cluster UUID
 * @param {Object} logstash The Logstash nodes keyed by Cluster UUID
 *
 * Returns the clusters joined with the Kibana and Logstash instances under each cluster's {@code stack_stats}.
 */


function handleAllStats(clusters, {
  kibana,
  logstash,
  beats
}) {
  return clusters.map(cluster => {
    const stats = { ...cluster,
      stack_stats: { ...cluster.stack_stats,
        // if they are using Kibana or Logstash, then add it to the cluster details under cluster.stack_stats
        ...getStackStats(cluster.cluster_uuid, kibana, _constants.KIBANA_SYSTEM_ID),
        ...getStackStats(cluster.cluster_uuid, logstash, _constants.LOGSTASH_SYSTEM_ID),
        ...getStackStats(cluster.cluster_uuid, beats, _constants.BEATS_SYSTEM_ID)
      }
    };
    mergeXPackStats(stats, kibana, 'graph_workspace', 'graph'); // copy graph_workspace info out of kibana, merge it into stack_stats.xpack.graph

    return stats;
  });
}

function getStackStats(clusterUuid, allProductStats, product) {
  const productStats = allProductStats[clusterUuid]; // Don't add it if they're not using (or configured to report stats) this product for this cluster

  return productStats ? {
    [product]: productStats
  } : {};
}

function mergeXPackStats(cluster, allProductStats, path, product) {
  const productStats = (0, _lodash.get)(allProductStats, cluster.cluster_uuid + '.' + path);

  if (productStats || productStats === 0) {
    if (!cluster.stack_stats) {
      cluster.stack_stats = {};
    }

    if (!cluster.stack_stats.xpack) {
      cluster.stack_stats.xpack = {};
    }

    const mergeStats = {};
    (0, _saferLodashSet.set)(mergeStats, path, productStats); // merge existing data with new stats

    cluster.stack_stats.xpack[product] = cluster.stack_stats.xpack[product] || {};
    (0, _lodash.merge)(cluster.stack_stats.xpack[product], mergeStats);
  }
}