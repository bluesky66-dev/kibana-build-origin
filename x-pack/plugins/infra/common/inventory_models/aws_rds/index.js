"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsRDS = void 0;

var _i18n = require("@kbn/i18n");

var _metrics = require("./metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const awsRDS = {
  id: 'awsRDS',
  displayName: _i18n.i18n.translate('xpack.infra.inventoryModels.awsRDS.displayName', {
    defaultMessage: 'RDS Databases'
  }),
  singularDisplayName: _i18n.i18n.translate('xpack.infra.inventoryModels.awsRDS.singularDisplayName', {
    defaultMessage: 'RDS Database'
  }),
  requiredModule: 'aws',
  crosslinkSupport: {
    details: true,
    logs: true,
    apm: false,
    uptime: false
  },
  metrics: _metrics.metrics,
  fields: {
    id: 'aws.rds.db_instance.arn',
    name: 'aws.rds.db_instance.identifier'
  },
  requiredMetrics: ['awsRDSCpuTotal', 'awsRDSConnections', 'awsRDSQueriesExecuted', 'awsRDSActiveTransactions', 'awsRDSLatency'],
  tooltipMetrics: ['cpu', 'rdsLatency', 'rdsConnections', 'rdsQueriesExecuted', 'rdsActiveTransactions']
};
exports.awsRDS = awsRDS;