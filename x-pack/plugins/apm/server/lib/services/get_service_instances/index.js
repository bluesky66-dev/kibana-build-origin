"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceInstances = getServiceInstances;

var _join_by_key = require("../../../../common/utils/join_by_key");

var _with_apm_span = require("../../../utils/with_apm_span");

var _get_service_instance_system_metric_stats = require("./get_service_instance_system_metric_stats");

var _get_service_instance_transaction_stats = require("./get_service_instance_transaction_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceInstances(params) {
  return (0, _with_apm_span.withApmSpan)('get_service_instances', async () => {
    const paramsForSubQueries = { ...params,
      size: 50
    };
    const [transactionStats, systemMetricStats] = await Promise.all([(0, _get_service_instance_transaction_stats.getServiceInstanceTransactionStats)(paramsForSubQueries), (0, _get_service_instance_system_metric_stats.getServiceInstanceSystemMetricStats)(paramsForSubQueries)]);
    const stats = (0, _join_by_key.joinByKey)([...transactionStats, ...systemMetricStats], 'serviceNodeName');
    return stats;
  });
}