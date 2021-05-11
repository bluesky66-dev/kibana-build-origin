"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsEC2 = void 0;

var _i18n = require("@kbn/i18n");

var _metrics = require("./metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const awsEC2 = {
  id: 'awsEC2',
  displayName: _i18n.i18n.translate('xpack.infra.inventoryModels.awsEC2.displayName', {
    defaultMessage: 'EC2 Instances'
  }),
  singularDisplayName: _i18n.i18n.translate('xpack.infra.inventoryModels.awsEC2.singularDisplayName', {
    defaultMessage: 'EC2 Instance'
  }),
  requiredModule: 'aws',
  crosslinkSupport: {
    details: true,
    logs: true,
    apm: true,
    uptime: true
  },
  metrics: _metrics.metrics,
  fields: {
    id: 'cloud.instance.id',
    name: 'cloud.instance.name',
    ip: 'aws.ec2.instance.public.ip'
  },
  requiredMetrics: ['awsEC2CpuUtilization', 'awsEC2NetworkTraffic', 'awsEC2DiskIOBytes'],
  tooltipMetrics: ['cpu', 'rx', 'tx'],
  nodeFilter: [{
    term: {
      'event.dataset': 'aws.ec2'
    }
  }]
};
exports.awsEC2 = awsEC2;