"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClusterStats = getClusterStats;
exports.getClusterUuids = void 0;

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Get the cluster stats from the connected cluster.
 *
 * This is the equivalent to GET /_cluster/stats?timeout=30s.
 */
async function getClusterStats(esClient) {
  const {
    body
  } = await esClient.cluster.stats({
    timeout: _constants.TIMEOUT
  });
  return body;
}
/**
 * Get the cluster uuids from the connected cluster.
 */


const getClusterUuids = async ({
  esClient
}) => {
  const {
    body
  } = await esClient.cluster.stats({
    timeout: _constants.TIMEOUT
  });
  return [{
    clusterUuid: body.cluster_uuid
  }];
};

exports.getClusterUuids = getClusterUuids;