"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.host = void 0;

var _i18n = require("@kbn/i18n");

var _metrics = require("./metrics");

var _required_metrics = require("../shared/metrics/required_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const host = {
  id: 'host',
  displayName: _i18n.i18n.translate('xpack.infra.inventoryModel.host.displayName', {
    defaultMessage: 'Hosts'
  }),
  singularDisplayName: _i18n.i18n.translate('xpack.infra.inventoryModels.host.singularDisplayName', {
    defaultMessage: 'Host'
  }),
  requiredModule: 'system',
  crosslinkSupport: {
    details: true,
    logs: true,
    apm: true,
    uptime: true
  },
  fields: {
    id: 'host.name',
    name: 'host.name',
    ip: 'host.ip'
  },
  metrics: _metrics.metrics,
  requiredMetrics: ['hostSystemOverview', 'hostCpuUsage', 'hostLoad', 'hostMemoryUsage', 'hostNetworkTraffic', 'hostK8sOverview', 'hostK8sCpuCap', 'hostK8sMemoryCap', 'hostK8sDiskCap', 'hostK8sPodCap', ..._required_metrics.aws, ..._required_metrics.nginx],
  tooltipMetrics: ['cpu', 'memory', 'tx', 'rx']
};
exports.host = host;