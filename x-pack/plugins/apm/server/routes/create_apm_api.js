"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApmApi = void 0;

var _index_pattern = require("./index_pattern");

var _create_api = require("./create_api");

var _environments = require("./environments");

var _errors = require("./errors");

var _services = require("./services");

var _agent_configuration = require("./settings/agent_configuration");

var _apm_indices = require("./settings/apm_indices");

var _metrics = require("./metrics");

var _service_nodes = require("./service_nodes");

var _traces = require("./traces");

var _correlations = require("./correlations");

var _transactions = require("./transactions");

var _service_map = require("./service_map");

var _custom_link = require("./settings/custom_link");

var _observability_overview = require("./observability_overview");

var _anomaly_detection = require("./settings/anomaly_detection");

var _rum_client = require("./rum_client");

var _chart_preview = require("./alerts/chart_preview");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createApmApi = () => {
  const api = (0, _create_api.createApi)() // index pattern
  .add(_index_pattern.staticIndexPatternRoute).add(_index_pattern.dynamicIndexPatternRoute).add(_index_pattern.apmIndexPatternTitleRoute) // Environments
  .add(_environments.environmentsRoute) // Errors
  .add(_errors.errorDistributionRoute).add(_errors.errorGroupsRoute).add(_errors.errorsRoute) // Services
  .add(_services.serviceAgentNameRoute).add(_services.serviceTransactionTypesRoute).add(_services.servicesRoute).add(_services.serviceNodeMetadataRoute).add(_services.serviceAnnotationsRoute).add(_services.serviceAnnotationsCreateRoute).add(_services.serviceErrorGroupsRoute).add(_services.serviceThroughputRoute).add(_services.serviceDependenciesRoute).add(_services.serviceMetadataDetailsRoute).add(_services.serviceMetadataIconsRoute).add(_services.serviceInstancesRoute) // Agent configuration
  .add(_agent_configuration.getSingleAgentConfigurationRoute).add(_agent_configuration.agentConfigurationAgentNameRoute).add(_agent_configuration.agentConfigurationRoute).add(_agent_configuration.agentConfigurationSearchRoute).add(_agent_configuration.deleteAgentConfigurationRoute).add(_agent_configuration.listAgentConfigurationEnvironmentsRoute).add(_agent_configuration.listAgentConfigurationServicesRoute).add(_agent_configuration.createOrUpdateAgentConfigurationRoute) // Correlations
  .add(_correlations.correlationsForSlowTransactionsRoute).add(_correlations.correlationsForFailedTransactionsRoute) // APM indices
  .add(_apm_indices.apmIndexSettingsRoute).add(_apm_indices.apmIndicesRoute).add(_apm_indices.saveApmIndicesRoute) // Metrics
  .add(_metrics.metricsChartsRoute).add(_service_nodes.serviceNodesRoute) // Traces
  .add(_traces.tracesRoute).add(_traces.tracesByIdRoute).add(_traces.rootTransactionByTraceIdRoute) // Transactions
  .add(_transactions.transactionChartsBreakdownRoute).add(_transactions.transactionChartsDistributionRoute).add(_transactions.transactionChartsErrorRateRoute).add(_transactions.transactionGroupsRoute).add(_transactions.transactionGroupsPrimaryStatisticsRoute).add(_transactions.transactionLatencyChartsRoute).add(_transactions.transactionThroughputChartsRoute).add(_transactions.transactionGroupsComparisonStatisticsRoute) // Service map
  .add(_service_map.serviceMapRoute).add(_service_map.serviceMapServiceNodeRoute) // Custom links
  .add(_custom_link.createCustomLinkRoute).add(_custom_link.updateCustomLinkRoute).add(_custom_link.deleteCustomLinkRoute).add(_custom_link.listCustomLinksRoute).add(_custom_link.customLinkTransactionRoute) // Observability dashboard
  .add(_observability_overview.observabilityOverviewHasDataRoute).add(_observability_overview.observabilityOverviewRoute) // Anomaly detection
  .add(_anomaly_detection.anomalyDetectionJobsRoute).add(_anomaly_detection.createAnomalyDetectionJobsRoute).add(_anomaly_detection.anomalyDetectionEnvironmentsRoute) // User Experience app api routes
  .add(_rum_client.rumOverviewLocalFiltersRoute).add(_rum_client.rumPageViewsTrendRoute).add(_rum_client.rumPageLoadDistributionRoute).add(_rum_client.rumPageLoadDistBreakdownRoute).add(_rum_client.rumClientMetricsRoute).add(_rum_client.rumServicesRoute).add(_rum_client.rumVisitorsBreakdownRoute).add(_rum_client.rumWebCoreVitals).add(_rum_client.rumJSErrors).add(_rum_client.rumUrlSearch).add(_rum_client.rumLongTaskMetrics).add(_rum_client.rumHasDataRoute) // Alerting
  .add(_chart_preview.transactionErrorCountChartPreview).add(_chart_preview.transactionDurationChartPreview).add(_chart_preview.transactionErrorRateChartPreview);
  return api;
};

exports.createApmApi = createApmApi;