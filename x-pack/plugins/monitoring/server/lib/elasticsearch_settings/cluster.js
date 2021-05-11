"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.checkClusterSettings = checkClusterSettings;

var _lodash = require("lodash");

var _find_reason = require("./find_reason");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleResponse(response, isCloudEnabled) {
  const sources = ['persistent', 'transient', 'defaults'];

  for (const source of sources) {
    const monitoringSettings = (0, _lodash.get)(response[source], 'xpack.monitoring');

    if (monitoringSettings !== undefined) {
      const check = (0, _find_reason.findReason)(monitoringSettings, {
        context: `cluster ${source}`
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

async function checkClusterSettings(req) {
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('admin');
  const {
    cloud
  } = req.server.newPlatform.setup.plugins;
  const isCloudEnabled = !!(cloud && cloud.isCloudEnabled);
  const response = await callWithRequest(req, 'transport.request', {
    method: 'GET',
    path: '/_cluster/settings?include_defaults',
    filter_path: ['persistent.xpack.monitoring', 'transient.xpack.monitoring', 'defaults.xpack.monitoring']
  });
  return handleResponse(response, isCloudEnabled);
}