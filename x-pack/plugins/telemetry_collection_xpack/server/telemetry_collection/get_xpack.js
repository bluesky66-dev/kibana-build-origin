"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getXPackUsage = getXPackUsage;

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get the cluster stats from the connected cluster.
 *
 * This is the equivalent of GET /_xpack/usage?master_timeout=${TIMEOUT}
 *
 * Like any X-Pack related API, X-Pack must installed for this to work.
 */


async function getXPackUsage(esClient) {
  const {
    body
  } = await esClient.xpack.usage({
    master_timeout: _constants.TIMEOUT
  });
  return body;
}