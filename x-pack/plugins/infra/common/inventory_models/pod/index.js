"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pod = void 0;

var _i18n = require("@kbn/i18n");

var _metrics = require("./metrics");

var _required_metrics = require("../shared/metrics/required_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const pod = {
  id: 'pod',
  displayName: _i18n.i18n.translate('xpack.infra.inventoryModel.pod.displayName', {
    defaultMessage: 'Kubernetes Pods'
  }),
  singularDisplayName: _i18n.i18n.translate('xpack.infra.inventoryModels.pod.singularDisplayName', {
    defaultMessage: 'Kubernetes Pod'
  }),
  requiredModule: 'kubernetes',
  crosslinkSupport: {
    details: true,
    logs: true,
    apm: true,
    uptime: true
  },
  fields: {
    id: 'kubernetes.pod.uid',
    name: 'kubernetes.pod.name',
    ip: 'kubernetes.pod.ip'
  },
  metrics: _metrics.metrics,
  requiredMetrics: ['podOverview', 'podCpuUsage', 'podMemoryUsage', 'podNetworkTraffic', ..._required_metrics.nginx],
  tooltipMetrics: ['cpu', 'memory', 'rx', 'tx']
};
exports.pod = pod;