"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monitoringEndpointDisableWatches = monitoringEndpointDisableWatches;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function monitoringEndpointDisableWatches(Client, _config, components) {
  const ca = components.clientAction.factory;
  Client.prototype.monitoring = components.clientAction.namespaceFactory();
  const monitoring = Client.prototype.monitoring.prototype;
  monitoring.disableWatches = ca({
    params: {},
    urls: [{
      fmt: '/_monitoring/migrate/alerts'
    }],
    method: 'POST'
  });
}