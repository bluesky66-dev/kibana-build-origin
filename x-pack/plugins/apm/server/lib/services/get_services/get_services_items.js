"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServicesItems = getServicesItems;

var _as_mutable_array = require("../../../../common/utils/as_mutable_array");

var _join_by_key = require("../../../../common/utils/join_by_key");

var _with_apm_span = require("../../../utils/with_apm_span");

var _get_health_statuses = require("./get_health_statuses");

var _get_services_from_metric_documents = require("./get_services_from_metric_documents");

var _get_service_transaction_stats = require("./get_service_transaction_stats");

var _services = require("../../../projections/services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAX_NUMBER_OF_SERVICES = 500;

async function getServicesItems({
  environment,
  setup,
  searchAggregatedTransactions,
  logger
}) {
  return (0, _with_apm_span.withApmSpan)('get_services_items', async () => {
    const params = {
      environment,
      projection: (0, _services.getServicesProjection)({
        setup,
        searchAggregatedTransactions
      }),
      setup,
      searchAggregatedTransactions,
      maxNumServices: MAX_NUMBER_OF_SERVICES
    };
    const [transactionStats, servicesFromMetricDocuments, healthStatuses] = await Promise.all([(0, _get_service_transaction_stats.getServiceTransactionStats)(params), (0, _get_services_from_metric_documents.getServicesFromMetricDocuments)(params), (0, _get_health_statuses.getHealthStatuses)(params).catch(err => {
      logger.error(err);
      return [];
    })]);
    const foundServiceNames = transactionStats.map(({
      serviceName
    }) => serviceName);
    const servicesWithOnlyMetricDocuments = servicesFromMetricDocuments.filter(({
      serviceName
    }) => !foundServiceNames.includes(serviceName));
    const allServiceNames = foundServiceNames.concat(servicesWithOnlyMetricDocuments.map(({
      serviceName
    }) => serviceName)); // make sure to exclude health statuses from services
    // that are not found in APM data

    const matchedHealthStatuses = healthStatuses.filter(({
      serviceName
    }) => allServiceNames.includes(serviceName));
    return (0, _join_by_key.joinByKey)((0, _as_mutable_array.asMutableArray)([...transactionStats, ...servicesWithOnlyMetricDocuments, ...matchedHealthStatuses]), 'serviceName');
  });
}