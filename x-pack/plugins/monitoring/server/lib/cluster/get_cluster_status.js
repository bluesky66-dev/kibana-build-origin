"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClusterStatus = getClusterStatus;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * @param cluster {Object} clusterStats from getClusterStatus
 * @param unassignedShards {Object} shardStats from getShardStats
 * @return top-level cluster summary data
 */


function getClusterStatus(cluster, shardStats) {
  var _cluster$cluster_stat, _clusterStats$nodes, _clusterStats$indices, _clusterIndices$shard, _clusterIndices$shard2, _cluster$cluster_stat2, _cluster$cluster_stat3, _clusterIndices$count, _clusterIndices$docs$, _clusterIndices$docs, _clusterIndices$store, _clusterIndices$store2, _clusterNodes$count$t, _clusterNodes$count, _clusterNodes$jvm$max, _clusterNodes$jvm, _clusterNodes$version, _clusterNodes$jvm$mem, _clusterNodes$jvm2, _clusterNodes$jvm2$me, _clusterNodes$jvm$mem2, _clusterNodes$jvm3, _clusterNodes$jvm3$me;

  const clusterStats = (_cluster$cluster_stat = cluster.cluster_stats) !== null && _cluster$cluster_stat !== void 0 ? _cluster$cluster_stat : {};
  const clusterNodes = (_clusterStats$nodes = clusterStats.nodes) !== null && _clusterStats$nodes !== void 0 ? _clusterStats$nodes : {};
  const clusterIndices = (_clusterStats$indices = clusterStats.indices) !== null && _clusterStats$indices !== void 0 ? _clusterStats$indices : {};
  const clusterTotalShards = (_clusterIndices$shard = (_clusterIndices$shard2 = clusterIndices.shards) === null || _clusterIndices$shard2 === void 0 ? void 0 : _clusterIndices$shard2.total) !== null && _clusterIndices$shard !== void 0 ? _clusterIndices$shard : 0;
  let unassignedShardsTotal = 0;
  const unassignedShards = (0, _lodash.get)(shardStats, 'indicesTotals.unassigned');

  if (unassignedShards !== undefined) {
    const {
      replica,
      primary
    } = unassignedShards;
    unassignedShardsTotal = replica + primary || 0; // replica + primary will be NaN if unassignedShards is not passed
  }

  const totalShards = clusterTotalShards + unassignedShardsTotal;
  return {
    status: (_cluster$cluster_stat2 = (_cluster$cluster_stat3 = cluster.cluster_state) === null || _cluster$cluster_stat3 === void 0 ? void 0 : _cluster$cluster_stat3.status) !== null && _cluster$cluster_stat2 !== void 0 ? _cluster$cluster_stat2 : 'unknown',
    // index-based stats
    indicesCount: (_clusterIndices$count = clusterIndices.count) !== null && _clusterIndices$count !== void 0 ? _clusterIndices$count : 0,
    documentCount: (_clusterIndices$docs$ = (_clusterIndices$docs = clusterIndices.docs) === null || _clusterIndices$docs === void 0 ? void 0 : _clusterIndices$docs.count) !== null && _clusterIndices$docs$ !== void 0 ? _clusterIndices$docs$ : 0,
    dataSize: (_clusterIndices$store = (_clusterIndices$store2 = clusterIndices.store) === null || _clusterIndices$store2 === void 0 ? void 0 : _clusterIndices$store2.size_in_bytes) !== null && _clusterIndices$store !== void 0 ? _clusterIndices$store : 0,
    // node-based stats
    nodesCount: (_clusterNodes$count$t = (_clusterNodes$count = clusterNodes.count) === null || _clusterNodes$count === void 0 ? void 0 : _clusterNodes$count.total) !== null && _clusterNodes$count$t !== void 0 ? _clusterNodes$count$t : 0,
    upTime: (_clusterNodes$jvm$max = (_clusterNodes$jvm = clusterNodes.jvm) === null || _clusterNodes$jvm === void 0 ? void 0 : _clusterNodes$jvm.max_uptime_in_millis) !== null && _clusterNodes$jvm$max !== void 0 ? _clusterNodes$jvm$max : 0,
    version: (_clusterNodes$version = clusterNodes.versions) !== null && _clusterNodes$version !== void 0 ? _clusterNodes$version : null,
    memUsed: (_clusterNodes$jvm$mem = (_clusterNodes$jvm2 = clusterNodes.jvm) === null || _clusterNodes$jvm2 === void 0 ? void 0 : (_clusterNodes$jvm2$me = _clusterNodes$jvm2.mem) === null || _clusterNodes$jvm2$me === void 0 ? void 0 : _clusterNodes$jvm2$me.heap_used_in_bytes) !== null && _clusterNodes$jvm$mem !== void 0 ? _clusterNodes$jvm$mem : 0,
    memMax: (_clusterNodes$jvm$mem2 = (_clusterNodes$jvm3 = clusterNodes.jvm) === null || _clusterNodes$jvm3 === void 0 ? void 0 : (_clusterNodes$jvm3$me = _clusterNodes$jvm3.mem) === null || _clusterNodes$jvm3$me === void 0 ? void 0 : _clusterNodes$jvm3$me.heap_max_in_bytes) !== null && _clusterNodes$jvm$mem2 !== void 0 ? _clusterNodes$jvm$mem2 : 0,
    unassignedShards: unassignedShardsTotal,
    totalShards
  };
}