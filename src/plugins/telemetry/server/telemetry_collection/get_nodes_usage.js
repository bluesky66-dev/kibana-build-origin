"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchNodesUsage = fetchNodesUsage;
exports.getNodesUsage = void 0;

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Get the nodes usage data from the connected cluster.
 *
 * This is the equivalent to GET /_nodes/usage?timeout=30s.
 *
 * The Nodes usage API was introduced in v6.0.0
 */
async function fetchNodesUsage(esClient) {
  const {
    body
  } = await esClient.nodes.usage({
    timeout: _constants.TIMEOUT
  });
  return body;
}
/**
 * Get the nodes usage from the connected cluster
 * @param callCluster APICaller
 * @returns Object containing array of modified usage information with the node_id nested within the data for that node.
 */


const getNodesUsage = async esClient => {
  const result = await fetchNodesUsage(esClient);
  const transformedNodes = Object.entries((result === null || result === void 0 ? void 0 : result.nodes) || {}).map(([key, value]) => ({ ...value,
    node_id: key
  }));
  return {
    nodes: transformedNodes
  };
};

exports.getNodesUsage = getNodesUsage;