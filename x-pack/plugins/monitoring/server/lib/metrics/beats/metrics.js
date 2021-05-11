"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _classes = require("./classes");

var _formatting = require("../../../../common/formatting");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const eventsRateTitle = _i18n.i18n.translate('xpack.monitoring.metrics.beats.eventsRateTitle', {
  defaultMessage: 'Events Rate'
});

const throughputTitle = _i18n.i18n.translate('xpack.monitoring.metrics.beats.throughputTitle', {
  defaultMessage: 'Throughput'
});

const failRatesTitle = _i18n.i18n.translate('xpack.monitoring.metrics.beats.failRatesTitle', {
  defaultMessage: 'Fail Rates'
});

const outputErrorsTitle = _i18n.i18n.translate('xpack.monitoring.metrics.beats.outputErrorsTitle', {
  defaultMessage: 'Output Errors'
});

const instanceEventsRateTitle = _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.eventsRateTitle', {
  defaultMessage: 'Events Rate'
});

const instanceFailRatesTitle = _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.failRatesTitle', {
  defaultMessage: 'Fail Rates'
});

const instanceThroughputTitle = _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.throughputTitle', {
  defaultMessage: 'Throughput'
});

const instanceOutputErrorsTitle = _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.outputErrorsTitle', {
  defaultMessage: 'Output Errors'
});

const instanceMemoryTitle = _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.memoryTitle', {
  defaultMessage: 'Memory'
});

const instanceSystemLoadTitle = _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.systemLoadTitle', {
  defaultMessage: 'System Load'
});

const metrics = {
  beat_cluster_pipeline_events_total_rate: new _classes.BeatsEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.pipeline.events.total',
    title: eventsRateTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.eventsRate.totalLabel', {
      defaultMessage: 'Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.eventsRate.totalDescription', {
      defaultMessage: 'All events newly created in the publishing pipeline'
    })
  }),
  beat_cluster_output_events_total: new _classes.BeatsEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.events.total',
    title: eventsRateTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.eventsRate.emittedLabel', {
      defaultMessage: 'Emitted'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.eventsRate.emittedDescription', {
      defaultMessage: 'Events processed by the output (including retries)'
    })
  }),
  beat_cluster_output_events_ack_rate: new _classes.BeatsEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.events.acked',
    title: eventsRateTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.eventsRate.acknowledgedLabel', {
      defaultMessage: 'Acknowledged'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.eventsRate.acknowledgedDescription', {
      defaultMessage: 'Events acknowledged by the output (includes events dropped by the output)'
    })
  }),
  beat_cluster_pipeline_events_emitted_rate: new _classes.BeatsEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.pipeline.events.published',
    title: eventsRateTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.eventsRate.queuedLabel', {
      defaultMessage: 'Queued'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.eventsRate.queuedDescription', {
      defaultMessage: 'Events added to the event pipeline queue'
    })
  }),
  beat_cluster_output_write_bytes_rate: new _classes.BeatsByteRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.write.bytes',
    title: throughputTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.throughput.bytesSentLabel', {
      defaultMessage: 'Bytes Sent'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.throughput.bytesSentDescription', {
      defaultMessage: 'Bytes written to the output (consists of size of network headers and compressed payload)'
    })
  }),
  beat_cluster_output_read_bytes_rate: new _classes.BeatsByteRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.read.bytes',
    title: throughputTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.throughput.bytesReceivedLabel', {
      defaultMessage: 'Bytes Received'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.throughput.bytesReceivedDescription', {
      defaultMessage: 'Bytes read in response from the output'
    })
  }),
  beat_cluster_pipeline_events_failed_rate: new _classes.BeatsEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.pipeline.events.failed',
    title: failRatesTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.failRates.failedInPipelineLabel', {
      defaultMessage: 'Failed in Pipeline'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.failRates.failedInPipelineDescription', {
      defaultMessage: 'Failures that happened before event was added to the publishing pipeline (output was disabled or publisher client closed)'
    })
  }),
  beat_cluster_pipeline_events_dropped_rate: new _classes.BeatsEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.pipeline.events.dropped',
    title: failRatesTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.failRates.droppedInPipelineLabel', {
      defaultMessage: 'Dropped in Pipeline'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.failRates.droppedInPipelineDescription', {
      defaultMessage: 'Events that have been dropped after N retries (N = max_retries setting)'
    })
  }),
  beat_cluster_output_events_dropped_rate: new _classes.BeatsEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.events.dropped',
    title: failRatesTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.failRates.droppedInOutputLabel', {
      defaultMessage: 'Dropped in Output'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.failRates.droppedInOutputDescription', {
      defaultMessage: '(Fatal drop) Events dropped by the output as being "invalid." The output still acknowledges the event ' + 'for the Beat to remove it from the queue.'
    })
  }),
  beat_cluster_pipeline_events_retry_rate: new _classes.BeatsEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.pipeline.events.retry',
    title: failRatesTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.failRates.retryInPipelineLabel', {
      defaultMessage: 'Retry in Pipeline'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.failRates.retryInPipelineDescription', {
      defaultMessage: 'Events in the pipeline that are trying again to be sent to the output'
    })
  }),
  beat_cluster_output_sending_errors: new _classes.BeatsEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.write.errors',
    title: outputErrorsTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.outputErrors.sendingLabel', {
      defaultMessage: 'Sending'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.outputErrors.sendingDescription', {
      defaultMessage: 'Errors in writing the response from the output'
    })
  }),
  beat_cluster_output_receiving_errors: new _classes.BeatsEventsRateClusterMetric({
    field: 'beats_stats.metrics.libbeat.output.read.errors',
    title: outputErrorsTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beats.outputErrors.receivingLabel', {
      defaultMessage: 'Receiving'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beats.outputErrors.receivingDescription', {
      defaultMessage: 'Errors in reading the response from the output'
    })
  }),

  /*
   * Beat Detail
   */
  beat_pipeline_events_total_rate: new _classes.BeatsEventsRateMetric({
    field: 'beats_stats.metrics.libbeat.pipeline.events.total',
    title: instanceEventsRateTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.eventsRate.newLabel', {
      defaultMessage: 'New'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.eventsRate.newDescription', {
      defaultMessage: 'New events sent to the publishing pipeline'
    })
  }),
  beat_output_events_total: new _classes.BeatsEventsRateMetric({
    field: 'beats_stats.metrics.libbeat.output.events.total',
    title: instanceEventsRateTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.eventsRate.emittedLabel', {
      defaultMessage: 'Emitted'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.eventsRate.emittedDescription', {
      defaultMessage: 'Events processed by the output (including retries)'
    })
  }),
  beat_output_events_ack_rate: new _classes.BeatsEventsRateMetric({
    field: 'beats_stats.metrics.libbeat.output.events.acked',
    title: instanceEventsRateTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.eventsRate.acknowledgedLabel', {
      defaultMessage: 'Acknowledged'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.eventsRate.acknowledgedDescription', {
      defaultMessage: 'Events acknowledged by the output (includes events dropped by the output)'
    })
  }),
  beat_pipeline_events_emitted_rate: new _classes.BeatsEventsRateMetric({
    field: 'beats_stats.metrics.libbeat.pipeline.events.published',
    title: instanceEventsRateTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.eventsRate.queuedLabel', {
      defaultMessage: 'Queued'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.eventsRate.queuedDescription', {
      defaultMessage: 'Events added to the event pipeline queue'
    })
  }),
  beat_pipeline_events_failed_rate: new _classes.BeatsEventsRateMetric({
    field: 'beats_stats.metrics.libbeat.pipeline.events.failed',
    title: instanceFailRatesTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.failRates.failedInPipelineLabel', {
      defaultMessage: 'Failed in Pipeline'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.failRates.failedInPipelineDescription', {
      defaultMessage: 'Failures that happened before event was added to the publishing pipeline (output was disabled or publisher client closed)'
    })
  }),
  beat_pipeline_events_dropped_rate: new _classes.BeatsEventsRateMetric({
    field: 'beats_stats.metrics.libbeat.pipeline.events.dropped',
    title: instanceFailRatesTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.failRates.droppedInPipelineLabel', {
      defaultMessage: 'Dropped in Pipeline'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.failRates.droppedInPipelineDescription', {
      defaultMessage: 'Events that have been dropped after N retries (N = max_retries setting)'
    })
  }),
  beat_output_events_dropped_rate: new _classes.BeatsEventsRateMetric({
    field: 'beats_stats.metrics.libbeat.output.events.dropped',
    title: instanceFailRatesTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.failRates.droppedInOutputLabel', {
      defaultMessage: 'Dropped in Output'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.failRates.droppedInOutputDescription', {
      defaultMessage: '(Fatal drop) Events dropped by the output as being "invalid." The output ' + 'still acknowledges the event for the Beat to remove it from the queue.'
    })
  }),
  beat_pipeline_events_retry_rate: new _classes.BeatsEventsRateMetric({
    field: 'beats_stats.metrics.libbeat.pipeline.events.retry',
    title: instanceFailRatesTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.failRates.retryInPipelineLabel', {
      defaultMessage: 'Retry in Pipeline'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.failRates.retryInPipelineDescription', {
      defaultMessage: 'Events in the pipeline that are trying again to be sent to the output'
    })
  }),
  beat_bytes_written: new _classes.BeatsByteRateMetric({
    field: 'beats_stats.metrics.libbeat.output.write.bytes',
    title: instanceThroughputTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.throughput.bytesSentLabel', {
      defaultMessage: 'Bytes Sent'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.throughput.bytesSentDescription', {
      defaultMessage: 'Bytes written to the output (consists of size of network headers and compressed payload)'
    })
  }),
  beat_output_write_bytes_rate: new _classes.BeatsByteRateMetric({
    field: 'beats_stats.metrics.libbeat.output.read.bytes',
    title: instanceThroughputTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.throughput.bytesReceivedLabel', {
      defaultMessage: 'Bytes Received'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.throughput.bytesReceivedDescription', {
      defaultMessage: 'Bytes read in response from the output'
    })
  }),
  beat_output_sending_errors: new _classes.BeatsEventsRateMetric({
    field: 'beats_stats.metrics.libbeat.output.write.errors',
    title: instanceOutputErrorsTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.outputErrors.sendingLabel', {
      defaultMessage: 'Sending'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.outputErrors.sendingDescription', {
      defaultMessage: 'Errors in writing the response from the output'
    })
  }),
  beat_output_receiving_errors: new _classes.BeatsEventsRateMetric({
    field: 'beats_stats.metrics.libbeat.output.read.errors',
    title: instanceOutputErrorsTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.outputErrors.receivingLabel', {
      defaultMessage: 'Receiving'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.outputErrors.receivingDescription', {
      defaultMessage: 'Errors in reading the response from the output'
    })
  }),
  beat_mem_alloc: new _classes.BeatsMetric({
    field: 'beats_stats.metrics.beat.memstats.memory_alloc',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.memory.activeLabel', {
      defaultMessage: 'Active'
    }),
    title: instanceMemoryTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.memory.activeDescription', {
      defaultMessage: 'Private memory in active use by the Beat'
    }),
    format: _formatting.LARGE_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  beat_mem_rss: new _classes.BeatsMetric({
    field: 'beats_stats.metrics.beat.memstats.rss',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.memory.processTotalLabel', {
      defaultMessage: 'Process Total'
    }),
    title: instanceMemoryTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.memory.processTotalDescription', {
      defaultMessage: 'Resident set size of memory reserved by the Beat from the OS'
    }),
    format: _formatting.LARGE_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  beat_mem_gc_next: new _classes.BeatsMetric({
    field: 'beats_stats.metrics.beat.memstats.gc_next',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.memory.gcNextLabel', {
      defaultMessage: 'GC Next'
    }),
    title: instanceMemoryTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.memory.gcNextDescription', {
      defaultMessage: 'Limit of allocated memory at which garbage collection will occur'
    }),
    format: _formatting.LARGE_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  beat_cpu_utilization: new _classes.BeatsCpuUtilizationMetric({
    title: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.cpuUtilizationTitle', {
      defaultMessage: 'CPU Utilization'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.cpuUtilization.totalLabel', {
      defaultMessage: 'Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.cpuUtilization.totalDescription', {
      defaultMessage: 'Percentage of CPU time spent executing (user+kernel mode) for the Beat process'
    }),
    field: 'beats_stats.metrics.beat.cpu.total.value'
  }),
  beat_system_os_load_1: new _classes.BeatsMetric({
    field: 'beats_stats.metrics.system.load.1',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.systemLoad.last1MinuteLabel', {
      defaultMessage: '1m'
    }),
    title: instanceSystemLoadTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.systemLoad.last1MinuteDescription', {
      defaultMessage: 'Load average over the last 1 minute'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  beat_system_os_load_5: new _classes.BeatsMetric({
    field: 'beats_stats.metrics.system.load.5',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.systemLoad.last5MinutesLabel', {
      defaultMessage: '5m'
    }),
    title: instanceSystemLoadTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.systemLoad.last5MinutesDescription', {
      defaultMessage: 'Load average over the last 5 minutes'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  beat_system_os_load_15: new _classes.BeatsMetric({
    field: 'beats_stats.metrics.system.load.15',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.systemLoad.last15MinutesLabel', {
      defaultMessage: '15m'
    }),
    title: instanceSystemLoadTitle,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.systemLoad.last15MinutesDescription', {
      defaultMessage: 'Load average over the last 15 minutes'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  beat_handles_open: new _classes.BeatsMetric({
    field: 'beats_stats.metrics.beat.handles.open',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.openHandlesTitle', {
      defaultMessage: 'Open Handles'
    }),
    title: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.openHandlesLabel', {
      defaultMessage: 'Open Handles'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.beatsInstance.openHandlesDescription', {
      defaultMessage: 'Count of open file handlers'
    }),
    format: _formatting.SMALL_FLOAT,
    metricAgg: 'max',
    units: ''
  })
};
exports.metrics = metrics;