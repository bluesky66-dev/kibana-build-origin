"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsSQS = void 0;

var _i18n = require("@kbn/i18n");

var _metrics = require("./metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const awsSQS = {
  id: 'awsSQS',
  displayName: _i18n.i18n.translate('xpack.infra.inventoryModels.awsSQS.displayName', {
    defaultMessage: 'SQS Queues'
  }),
  singularDisplayName: _i18n.i18n.translate('xpack.infra.inventoryModels.awsSQS.singularDisplayName', {
    defaultMessage: 'SQS Queue'
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
    id: 'aws.sqs.queue.name',
    name: 'aws.sqs.queue.name'
  },
  requiredMetrics: ['awsSQSMessagesVisible', 'awsSQSMessagesDelayed', 'awsSQSMessagesSent', 'awsSQSMessagesEmpty', 'awsSQSOldestMessage'],
  tooltipMetrics: ['sqsMessagesVisible', 'sqsMessagesDelayed', 'sqsMessagesEmpty', 'sqsMessagesSent', 'sqsOldestMessage']
};
exports.awsSQS = awsSQS;