"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPaginatedNodes = getPaginatedNodes;

var _lodash = require("lodash");

var _get_node_ids = require("./get_node_ids");

var _filter = require("../../../pagination/filter");

var _sort_nodes = require("./sort_nodes");

var _paginate = require("../../../pagination/paginate");

var _get_metrics = require("../../../details/get_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This function performs an optimization around the node listing tables in the UI. To avoid
 * query performances in Elasticsearch (mainly thinking of `search.max_buckets` overflows), we do
 * not want to fetch all time-series data for all nodes. Instead, we only want to fetch the
 * time-series data for the nodes visible in the listing table. This function accepts
 * pagination/sorting/filtering data to determine which nodes will be visible in the table
 * and returns that so the caller can perform their normal call to get the time-series data.
 *
 * @param {*} req - Server request object
 * @param {*} esIndexPattern - The index pattern to search against (`.monitoring-es-*`)
 * @param {*} uuids - The optional `clusterUuid` and `nodeUuid` to filter the results from
 * @param {*} metricSet - The array of metrics that are sortable in the UI
 * @param {*} pagination - ({ index, size })
 * @param {*} sort - ({ field, direction })
 * @param {*} queryText - Text that will be used to filter out pipelines
 */


async function getPaginatedNodes(req, esIndexPattern, {
  clusterUuid
}, metricSet, pagination, sort, queryText, {
  clusterStats,
  nodesShardCount
}) {
  const config = req.server.config();
  const size = config.get('monitoring.ui.max_bucket_size');
  const nodes = await (0, _get_node_ids.getNodeIds)(req, esIndexPattern, {
    clusterUuid
  }, size); // Add `isOnline` and shards from the cluster state and shard stats

  const clusterState = (0, _lodash.get)(clusterStats, 'cluster_state', {
    nodes: {}
  });

  for (const node of nodes) {
    node.isOnline = !(0, _lodash.isUndefined)((0, _lodash.get)(clusterState, ['nodes', node.uuid]));
    node.shardCount = (0, _lodash.get)(nodesShardCount, `nodes[${node.uuid}].shardCount`, 0);
  } // `metricSet` defines a list of metrics that are sortable in the UI
  // but we don't need to fetch all the data for these metrics to perform
  // the necessary sort - we only need the last bucket of data so we
  // fetch the last two buckets of data (to ensure we have a single full bucekt),
  // then return the value from that last bucket


  const filters = [{
    terms: {
      'source_node.name': nodes.map(node => node.name)
    }
  }];
  const groupBy = {
    field: `source_node.uuid`,
    include: nodes.map(node => node.uuid),
    size: config.get('monitoring.ui.max_bucket_size')
  };
  const metricSeriesData = await (0, _get_metrics.getMetrics)(req, esIndexPattern, metricSet, filters, {
    nodes
  }, 4, groupBy);

  for (const metricName in metricSeriesData) {
    if (!metricSeriesData.hasOwnProperty(metricName)) {
      continue;
    }

    const metricList = metricSeriesData[metricName];

    for (const metricItem of metricList[0]) {
      const node = nodes.find(node => node.uuid === metricItem.groupedBy);

      if (!node) {
        continue;
      }

      const dataSeries = metricItem.data;

      if (dataSeries && dataSeries.length) {
        const lastItem = dataSeries[dataSeries.length - 1];

        if (lastItem.length && lastItem.length === 2) {
          node[metricName] = lastItem[1];
        }
      }
    }
  } // Manually apply pagination/sorting/filtering concerns
  // Filtering


  const filteredNodes = (0, _filter.filter)(nodes, queryText, ['name']); // We only support filtering by name right now
  // Sorting

  const sortedNodes = (0, _sort_nodes.sortNodes)(filteredNodes, sort); // Pagination

  const pageOfNodes = (0, _paginate.paginate)(pagination, sortedNodes);
  return {
    pageOfNodes,
    totalNodeCount: filteredNodes.length
  };
}