"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _formatting = require("../../../../common/formatting");

var _classes = require("./classes");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const instanceSystemLoadTitle = _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.systemLoadTitle', {
  defaultMessage: 'System Load'
});

const instanceMemoryTitle = _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.memoryTitle', {
  defaultMessage: 'Memory'
});

const transformationsTitle = _i18n.i18n.translate('xpack.monitoring.metrics.apm.transformationsTitle', {
  defaultMessage: 'Transformations'
});

const metrics = {
  apm_cpu_total: new _classes.ApmCpuUtilizationMetric({
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.cpuUtilizationTitle', {
      defaultMessage: 'CPU Utilization'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.cpuUtilization.totalLabel', {
      defaultMessage: 'Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.cpuUtilization.totalDescription', {
      defaultMessage: 'Percentage of CPU time spent executing (user+kernel mode) for the APM process'
    }),
    field: 'beats_stats.metrics.beat.cpu.total.value'
  }),
  apm_system_os_load_1: new _classes.ApmMetric({
    field: 'beats_stats.metrics.system.load.1',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.systemLoad.last1MinuteLabel', {
      defaultMessage: '1m'
    }),
    title: instanceSystemLoadTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.systemLoad.last1MinuteDescription', {
      defaultMessage: 'Load average over the last 1 minute'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  apm_system_os_load_5: new _classes.ApmMetric({
    field: 'beats_stats.metrics.system.load.5',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.systemLoad.last5MinutesLabel', {
      defaultMessage: '5m'
    }),
    title: instanceSystemLoadTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.systemLoad.last5MinutesDescription', {
      defaultMessage: 'Load average over the last 5 minutes'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  apm_system_os_load_15: new _classes.ApmMetric({
    field: 'beats_stats.metrics.system.load.15',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.systemLoad.last15MinutesLabel', {
      defaultMessage: '15m'
    }),
    title: instanceSystemLoadTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.systemLoad.last15MinutesDescription', {
      defaultMessage: 'Load average over the last 15 minutes'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  apm_mem_gc_next: new _classes.ApmMetric({
    field: 'beats_stats.metrics.beat.memstats.gc_next',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.memory.gcNextLabel', {
      defaultMessage: 'GC Next'
    }),
    title: instanceMemoryTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.memory.gcNextDescription', {
      defaultMessage: 'Limit of allocated memory at which garbage collection will occur'
    }),
    format: _formatting.LARGE_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  apm_mem_alloc: new _classes.ApmMetric({
    field: 'beats_stats.metrics.beat.memstats.memory_alloc',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.memory.allocatedMemoryLabel', {
      defaultMessage: 'Allocated Memory'
    }),
    title: instanceMemoryTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.memory.allocatedMemoryDescription', {
      defaultMessage: 'Allocated memory'
    }),
    format: _formatting.LARGE_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  apm_mem_rss: new _classes.ApmMetric({
    field: 'beats_stats.metrics.beat.memstats.rss',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.memory.processTotalLabel', {
      defaultMessage: 'Process Total'
    }),
    title: instanceMemoryTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apmInstance.memory.processTotalDescription', {
      defaultMessage: 'Resident set size of memory reserved by the APM service from the OS'
    }),
    format: _formatting.LARGE_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  apm_requests: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.request.count',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.requestsTitle', {
      defaultMessage: 'Request Count Intake API'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.requests.requestedLabel', {
      defaultMessage: 'Requested'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.requests.requestedDescription', {
      defaultMessage: 'HTTP Requests received by server'
    })
  }),
  apm_responses_count: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.count',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseCountTitle', {
      defaultMessage: 'Response Count Intake API'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseCount.totalLabel', {
      defaultMessage: 'Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseCount.totalDescription', {
      defaultMessage: 'HTTP Requests responded to by server'
    })
  }),
  apm_responses_valid_ok: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.valid.ok',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.response.okTitle', {
      defaultMessage: 'Ok'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.response.okLabel', {
      defaultMessage: 'Ok'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.response.okDescription', {
      defaultMessage: '200 OK response count'
    })
  }),
  apm_responses_valid_accepted: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.valid.accepted',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.response.acceptedTitle', {
      defaultMessage: 'Accepted'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.response.acceptedLabel', {
      defaultMessage: 'Accepted'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.response.acceptedDescription', {
      defaultMessage: 'HTTP Requests successfully reporting new events'
    })
  }),
  apm_responses_errors_toolarge: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.errors.toolarge',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrorsTitle', {
      defaultMessage: 'Response Errors Intake API'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.tooLargeLabelTitle', {
      defaultMessage: 'Too large'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.tooLargeLabelDescription', {
      defaultMessage: 'HTTP Requests rejected due to excessive payload size'
    })
  }),
  apm_responses_errors_validate: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.errors.validate',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.validateTitle', {
      defaultMessage: 'Validate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.validateLabel', {
      defaultMessage: 'Validate'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.validateDescription', {
      defaultMessage: 'HTTP Requests rejected due to payload validation error'
    })
  }),
  apm_responses_errors_method: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.errors.method',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.methodTitle', {
      defaultMessage: 'Method'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.methodLabel', {
      defaultMessage: 'Method'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.methodDescription', {
      defaultMessage: 'HTTP Requests rejected due to incorrect HTTP method'
    })
  }),
  apm_responses_errors_unauthorized: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.errors.unauthorized',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.unauthorizedTitle', {
      defaultMessage: 'Unauthorized'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.unauthorizedLabel', {
      defaultMessage: 'Unauthorized'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.unauthorizedDescription', {
      defaultMessage: 'HTTP Requests rejected due to invalid secret token'
    })
  }),
  apm_responses_errors_ratelimit: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.errors.ratelimit',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.rateLimitTitle', {
      defaultMessage: 'Rate limit'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.rateLimitLabel', {
      defaultMessage: 'Rate limit'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.rateLimitDescription', {
      defaultMessage: 'HTTP Requests rejected to due excessive rate limit'
    })
  }),
  apm_responses_errors_queue: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.errors.queue',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.queueTitle', {
      defaultMessage: 'Queue'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.queueLabel', {
      defaultMessage: 'Queue'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.queueDescription', {
      defaultMessage: 'HTTP Requests rejected to due internal queue filling up'
    })
  }),
  apm_responses_errors_decode: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.errors.decode',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.decodeTitle', {
      defaultMessage: 'Decode'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.decodeLabel', {
      defaultMessage: 'Decode'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.decodeDescription', {
      defaultMessage: 'HTTP Requests rejected to due decoding errors - invalid json, incorrect data type for entity'
    })
  }),
  apm_responses_errors_forbidden: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.errors.forbidden',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.forbiddenTitle', {
      defaultMessage: 'Forbidden'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.forbiddenLabel', {
      defaultMessage: 'Forbidden'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.forbiddenDescription', {
      defaultMessage: 'Forbidden HTTP Requests rejected - CORS violation, disabled enpoint'
    })
  }),
  apm_responses_errors_concurrency: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.errors.concurrency',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.concurrencyTitle', {
      defaultMessage: 'Concurrency'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.concurrencyLabel', {
      defaultMessage: 'Concurrency'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.concurrencyDescription', {
      defaultMessage: 'HTTP Requests rejected due to overall concurrency limit breach'
    })
  }),
  apm_responses_errors_closed: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.errors.closed',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.closedTitle', {
      defaultMessage: 'Closed'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.closedLabel', {
      defaultMessage: 'Closed'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.closedDescription', {
      defaultMessage: 'HTTP Requests rejected during server shutdown'
    })
  }),
  apm_responses_errors_internal: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.server.response.errors.internal',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.internalTitle', {
      defaultMessage: 'Internal'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.internalLabel', {
      defaultMessage: 'Internal'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.responseErrors.internalDescription', {
      defaultMessage: 'HTTP Requests rejected due to a miscellaneous internal error'
    })
  }),
  apm_processor_transaction_transformations: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.processor.transaction.transformations',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.processedEventsTitle', {
      defaultMessage: 'Processed Events'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.processedEvents.transactionLabel', {
      defaultMessage: 'Transaction'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.processedEvents.transactionDescription', {
      defaultMessage: 'Transaction events processed'
    })
  }),
  apm_processor_span_transformations: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.processor.span.transformations',
    title: transformationsTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.transformations.spanLabel', {
      defaultMessage: 'Span'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.transformations.spanDescription', {
      defaultMessage: 'Span events processed'
    })
  }),
  apm_processor_error_transformations: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.processor.error.transformations',
    title: transformationsTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.transformations.errorLabel', {
      defaultMessage: 'Error'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.transformations.errorDescription', {
      defaultMessage: 'Error events processed'
    })
  }),
  apm_processor_metric_transformations: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.processor.metric.transformations',
    title: transformationsTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.transformations.metricLabel', {
      defaultMessage: 'Metric'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.transformations.metricDescription', {
      defaultMessage: 'Metric events processed'
    })
  }),
  apm_output_events_total: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.events.total',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputEventsRateTitle', {
      defaultMessage: 'Output Events Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputEventsRate.totalLabel', {
      defaultMessage: 'Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputEventsRate.totalDescription', {
      defaultMessage: 'Events processed by the output (including retries)'
    })
  }),
  apm_output_events_failed: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.events.failed',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputFailedEventsRateTitle', {
      defaultMessage: 'Output Failed Events Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputFailedEventsRate.failedLabel', {
      defaultMessage: 'Failed'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputFailedEventsRate.failedDescription', {
      defaultMessage: 'Events processed by the output (including retries)'
    })
  }),
  apm_output_events_dropped: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.events.dropped',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputDroppedEventsRateTitle', {
      defaultMessage: 'Output Dropped Events Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputDroppedEventsRate.droppedLabel', {
      defaultMessage: 'Dropped'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputDroppedEventsRate.droppedDescription', {
      defaultMessage: 'Events processed by the output (including retries)'
    })
  }),
  apm_output_events_active: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.events.active',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputActiveEventsRateTitle', {
      defaultMessage: 'Output Active Events Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputActiveEventsRate.activeLabel', {
      defaultMessage: 'Active'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputActiveEventsRate.activeDescription', {
      defaultMessage: 'Events processed by the output (including retries)'
    })
  }),
  apm_output_events_acked: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.events.acked',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputAckedEventsRateTitle', {
      defaultMessage: 'Output Acked Events Rate'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputAckedEventsRate.ackedLabel', {
      defaultMessage: 'Acked'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.outputAckedEventsRate.ackedDescription', {
      defaultMessage: 'Events processed by the output (including retries)'
    })
  }),
  apm_acm_response_count: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.acm.response.count',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.countTitle', {
      defaultMessage: 'Response Count Agent Configuration Management'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.countLabel', {
      defaultMessage: 'Count'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.countDescription', {
      defaultMessage: 'HTTP requests responded to by APM Server'
    })
  }),
  apm_acm_response_errors_count: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.acm.response.errors.count',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errorCountTitle', {
      defaultMessage: 'Response Error Count Agent Configuration Management'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errorCountLabel', {
      defaultMessage: 'Error Count'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errorCountDescription', {
      defaultMessage: 'HTTP errors count'
    })
  }),
  apm_acm_response_valid_ok: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.acm.response.valid.ok',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.validOkTitle', {
      defaultMessage: 'Response OK Count Agent Configuration Management'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.validOkLabel', {
      defaultMessage: 'OK'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.validOkDescription', {
      defaultMessage: '200 OK response count'
    })
  }),
  apm_acm_response_valid_notmodified: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.acm.response.valid.notmodified',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.validNotModifiedTitle', {
      defaultMessage: 'Response Not Modified Agent Configuration Management'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.validNotModifiedLabel', {
      defaultMessage: 'Not Modified'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.validNotModifiedDescription', {
      defaultMessage: '304 Not modified response count'
    })
  }),
  apm_acm_response_errors_forbidden: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.acm.response.errors.forbidden',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.forbiddenTitle', {
      defaultMessage: 'Response Errors Agent Configuration Management'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.forbiddenLabel', {
      defaultMessage: 'Count'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.forbiddenDescription', {
      defaultMessage: 'Forbidden HTTP requests rejected count'
    })
  }),
  apm_acm_response_errors_unauthorized: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.acm.response.errors.unauthorized',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.unauthorizedTitle', {
      defaultMessage: 'Response Unauthorized Errors Agent Configuration Management'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.unauthorizedLabel', {
      defaultMessage: 'Unauthorized'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.unauthorizedDescription', {
      defaultMessage: 'Unauthorized HTTP requests rejected count'
    })
  }),
  apm_acm_response_errors_unavailable: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.acm.response.errors.unavailable',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.unavailableTitle', {
      defaultMessage: 'Response Unavailable Errors Agent Configuration Management'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.unavailableLabel', {
      defaultMessage: 'Unavailable'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.unavailableDescription', {
      defaultMessage: 'Unavailable HTTP response count. Possible misconfiguration or unsupported version of Kibana'
    })
  }),
  apm_acm_response_errors_method: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.acm.response.errors.method',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.methodTitle', {
      defaultMessage: 'Response Method Errors Agent Configuration Management'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.methodLabel', {
      defaultMessage: 'Method'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.methodDescription', {
      defaultMessage: 'HTTP requests rejected due to incorrect HTTP method'
    })
  }),
  apm_acm_response_errors_invalidquery: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.acm.response.errors.invalidquery',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.invalidqueryTitle', {
      defaultMessage: 'Response Invalid Query Errors Agent Configuration Management'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.invalidqueryLabel', {
      defaultMessage: 'Invalid Query'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmResponse.errors.invalidqueryDescription', {
      defaultMessage: 'Invalid HTTP query'
    })
  }),
  apm_acm_request_count: new _classes.ApmEventsRateClusterMetric({
    field: 'beats_stats.metrics.apm-server.acm.request.count',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmRequest.countTitle', {
      defaultMessage: 'Requests Agent Configuration Management'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmRequest.countTitleLabel', {
      defaultMessage: 'Count'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.apm.acmRequest.countTitleDescription', {
      defaultMessage: 'HTTP Requests received by agent configuration managemen'
    })
  })
};
exports.metrics = metrics;