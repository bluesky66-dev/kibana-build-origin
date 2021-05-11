"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disableWatcherClusterAlerts = disableWatcherClusterAlerts;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function callMigrationApi(callCluster, logger) {
  try {
    return await callCluster('monitoring.disableWatches');
  } catch (err) {
    logger.warn(`Unable to call migration api to disable cluster alert watches. Message=${err.message}`);
    return undefined;
  }
}

async function disableWatcherClusterAlerts(callCluster, logger) {
  const response = await callMigrationApi(callCluster, logger);

  if (!response || response.exporters.length === 0) {
    return true;
  }

  const list = response.exporters[0];

  if (list.length === 0) {
    return true;
  }

  let removedAll = true;

  for (const exporter of list) {
    if (!exporter.migration_complete) {
      if (exporter.reason) {
        logger.warn(`Unable to remove exporter type=${exporter.type} and name=${exporter.name} because ${exporter.reason.type}: ${exporter.reason.reason}`);
        removedAll = false;
      }
    }
  }

  return removedAll;
}