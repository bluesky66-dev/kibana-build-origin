"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.instantiateClient = instantiateClient;
exports.hasMonitoringCluster = hasMonitoringCluster;

var _monitoring_bulk = require("../kibana_monitoring/lib/monitoring_bulk");

var _monitoring_endpoint_disable_watches = require("./monitoring_endpoint_disable_watches");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


function instantiateClient(elasticsearchConfig, log, createClient) {
  const isMonitoringCluster = hasMonitoringCluster(elasticsearchConfig);
  const cluster = createClient('monitoring', { ...(isMonitoringCluster ? elasticsearchConfig : {}),
    plugins: [_monitoring_bulk.monitoringBulk, _monitoring_endpoint_disable_watches.monitoringEndpointDisableWatches]
  });
  const configSource = isMonitoringCluster ? 'monitoring' : 'production';
  log.info(`config sourced from: ${configSource} cluster`);
  return cluster;
}

function hasMonitoringCluster(config) {
  return Boolean(config.hosts && config.hosts[0]);
}