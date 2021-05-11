"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMlNodeCount = getMlNodeCount;
exports.getLazyMlNodeCount = getLazyMlNodeCount;
exports.countJobsLazyStarting = countJobsLazyStarting;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getMlNodeCount(client) {
  const {
    body
  } = await client.asInternalUser.nodes.info({
    filter_path: 'nodes.*.attributes'
  });
  let count = 0;

  if (typeof body.nodes === 'object') {
    Object.keys(body.nodes).forEach(k => {
      if (body.nodes[k].attributes !== undefined) {
        const maxOpenJobs = body.nodes[k].attributes['ml.max_open_jobs'];

        if (maxOpenJobs !== null && maxOpenJobs > 0) {
          count++;
        }
      }
    });
  }

  const lazyNodeCount = await getLazyMlNodeCount(client);
  return {
    count,
    lazyNodeCount
  };
}

async function getLazyMlNodeCount(client) {
  var _xpack;

  const {
    body
  } = await client.asInternalUser.cluster.getSettings({
    include_defaults: true,
    filter_path: '**.xpack.ml.max_lazy_ml_nodes'
  });
  const lazyMlNodesString = (_xpack = (body.defaults || body.persistent || body.transient || {}).xpack) === null || _xpack === void 0 ? void 0 : _xpack.ml.max_lazy_ml_nodes;
  const count = lazyMlNodesString === undefined ? 0 : +lazyMlNodesString;

  if (count === 0 || isNaN(count)) {
    return 0;
  }

  return count;
}

async function countJobsLazyStarting(client, startingJobsCount) {
  const lazyMlNodesCount = await getLazyMlNodeCount(client);
  const {
    count: currentMlNodeCount
  } = await getMlNodeCount(client);
  const availableLazyMlNodes = lazyMlNodesCount !== null && lazyMlNodesCount !== void 0 ? lazyMlNodesCount : lazyMlNodesCount - currentMlNodeCount;
  let lazilyStartingJobsCount = startingJobsCount;

  if (startingJobsCount > availableLazyMlNodes) {
    if (lazyMlNodesCount > currentMlNodeCount) {
      lazilyStartingJobsCount = availableLazyMlNodes;
    }
  }

  const response = {
    availableLazyMlNodes,
    currentMlNodeCount,
    lazilyStartingJobsCount,
    totalStartingJobs: startingJobsCount
  };
  return response;
}