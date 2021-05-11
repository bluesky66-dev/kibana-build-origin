"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClusterInfo = getClusterInfo;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// This can be removed when the ES client improves the types

/**
 * Get the cluster info from the connected cluster.
 *
 * This is the equivalent to GET /
 *
 * @param {function} esClient The asInternalUser handler (exposed for testing)
 */
async function getClusterInfo(esClient) {
  const {
    body
  } = await esClient.info();
  return body;
}