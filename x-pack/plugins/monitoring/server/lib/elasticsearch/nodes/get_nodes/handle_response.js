"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _map_nodes_info = require("./map_nodes_info");

var _map_nodes_metrics = require("./map_nodes_metrics");

var _convert_metric_names = require("../../convert_metric_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore

/*
 * Process the response from the get_nodes query
 * @param {Object} response: response data from get_nodes
 * @param {Object} clusterStats: cluster stats from cluster state document
 * @param {Object} nodesShardCount: per-node information about shards
 * @param {Object} timeOptions: min, max, and bucketSize needed for date histogram creation
 * @return {Array} node info combined with metrics for each node
 */


function handleResponse(response, clusterStats, nodesShardCount, pageOfNodes, timeOptions = {}) {
  var _response$hits$hits, _response$hits;

  if (!(0, _lodash.get)(response, 'hits.hits')) {
    return [];
  }

  const nodeHits = (_response$hits$hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) !== null && _response$hits$hits !== void 0 ? _response$hits$hits : [];
  const nodesInfo = (0, _map_nodes_info.mapNodesInfo)(nodeHits, clusterStats, nodesShardCount);
  /*
   * Every node bucket is an object with a field for nodeId and fields for
   * metric buckets. This builds an object that has every nodeId as a property,
   * with a sub-object for all the metrics buckets
   */

  const nodeBuckets = (0, _lodash.get)(response, 'aggregations.nodes.buckets', []);
  const metricsForNodes = nodeBuckets.reduce((accum, {
    key: nodeId,
    by_date: byDate
  }) => {
    return { ...accum,
      [nodeId]: (0, _convert_metric_names.uncovertMetricNames)(byDate)
    };
  }, {});
  const nodesMetrics = (0, _map_nodes_metrics.mapNodesMetrics)(metricsForNodes, nodesInfo, timeOptions); // summarize the metrics of online nodes
  // nodesInfo is the source of truth for the nodeIds, where nodesMetrics will lack metrics for offline nodes

  const nodes = pageOfNodes.map(node => ({ ...node,
    ...(nodesInfo && nodesInfo[node.uuid] ? nodesInfo[node.uuid] : {}),
    ...(nodesMetrics && nodesMetrics[node.uuid] ? nodesMetrics[node.uuid] : {}),
    resolver: node.uuid
  }));
  return nodes;
}