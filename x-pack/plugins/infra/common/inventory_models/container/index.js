"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.container = void 0;

var _i18n = require("@kbn/i18n");

var _metrics = require("./metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const container = {
  id: 'container',
  displayName: _i18n.i18n.translate('xpack.infra.inventoryModel.container.displayName', {
    defaultMessage: 'Docker Containers'
  }),
  singularDisplayName: _i18n.i18n.translate('xpack.infra.inventoryModel.container.singularDisplayName', {
    defaultMessage: 'Docker Container'
  }),
  requiredModule: 'docker',
  crosslinkSupport: {
    details: true,
    logs: true,
    apm: true,
    uptime: true
  },
  fields: {
    id: 'container.id',
    name: 'container.name',
    ip: 'container.ip_address'
  },
  metrics: _metrics.metrics,
  requiredMetrics: ['containerOverview', 'containerCpuUsage', 'containerMemory', 'containerNetworkTraffic', 'containerDiskIOBytes', 'containerDiskIOOps'],
  tooltipMetrics: ['cpu', 'memory', 'rx', 'tx']
};
exports.container = container;