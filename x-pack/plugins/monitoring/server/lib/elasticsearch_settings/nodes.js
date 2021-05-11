"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.checkNodesSettings = checkNodesSettings;

var _lodash = require("lodash");

var _find_reason = require("./find_reason");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleResponse({
  nodes = {}
} = {}, isCloudEnabled) {
  const nodeIds = Object.keys(nodes);

  for (const nodeId of nodeIds) {
    const nodeSettings = (0, _lodash.get)(nodes, [nodeId, 'settings']);

    if (nodeSettings !== undefined) {
      const monitoringSettings = (0, _lodash.get)(nodeSettings, 'xpack.monitoring');
      const check = (0, _find_reason.findReason)(monitoringSettings, {
        context: `nodeId: ${nodeId}`
      }, isCloudEnabled);

      if (check.found) {
        return check;
      }
    }
  }

  return {
    found: false
  };
}

async function checkNodesSettings(req) {
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('admin');
  const {
    cloud
  } = req.server.newPlatform.setup.plugins;
  const isCloudEnabled = !!(cloud && cloud.isCloudEnabled);
  const response = await callWithRequest(req, 'transport.request', {
    method: 'GET',
    path: '/_nodes/settings',
    filter_path: ['nodes'] // NOTE: this doesn't seem to do anything when used with elasticsearch-js. In Console, it does work though

  });
  return handleResponse(response, isCloudEnabled);
}