"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAvailableCcs = fetchAvailableCcs;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function fetchAvailableCcs(callCluster) {
  const availableCcs = [];
  const response = await callCluster('cluster.remoteInfo');

  for (const remoteName in response) {
    if (!response.hasOwnProperty(remoteName)) {
      continue;
    }

    const remoteInfo = response[remoteName];

    if (remoteInfo.connected) {
      availableCcs.push(remoteName);
    }
  }

  return availableCcs;
}