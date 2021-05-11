"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _classes = require("../classes");

var _classes2 = require("./classes");

var _formatting = require("../../../../common/formatting");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const instanceSystemLoadTitle = _i18n.i18n.translate('xpack.monitoring.metrics.logstash.systemLoadTitle', {
  defaultMessage: 'System Load'
});

const instanceJvmHeapTitle = _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.jvmHeapTitle', {
  defaultMessage: '{javaVirtualMachine} Heap',
  values: {
    javaVirtualMachine: 'JVM'
  }
});

const instanceCpuUtilizationLabel = _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cpuUtilizationLabel', {
  defaultMessage: 'CPU Utilization'
});

const instanceCgroupCfsStatsTitle = _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cgroupCfsStatsTitle', {
  defaultMessage: 'Cgroup CFS Stats'
});

const instanceCgroupCpuPerformanceTitle = _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cgroupCpuPerformanceTitle', {
  defaultMessage: 'Cgroup CPU Performance'
});

const pipelineThroughputLabel = _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.pipelineThroughputLabel', {
  defaultMessage: 'Pipeline Throughput'
});

const pipelineThroughputDescription = _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.pipelineThroughputDescription', {
  defaultMessage: 'Number of events emitted per second by the Logstash pipeline at the outputs stage.'
});

const pipelineNodeCountLabel = _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.pipelineNodeCountLabel', {
  defaultMessage: 'Pipeline Node Count'
});

const pipelineNodeCountDescription = _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.pipelineNodeCountDescription', {
  defaultMessage: 'Number of nodes on which the Logstash pipeline is running.'
});

const nsTimeUnitLabel = _i18n.i18n.translate('xpack.monitoring.metrics.logstash.nsTimeUnitLabel', {
  defaultMessage: 'ns'
});

const eventsPerSecondUnitLabel = _i18n.i18n.translate('xpack.monitoring.metrics.logstash.eventsPerSecondUnitLabel', {
  defaultMessage: 'e/s'
});

const metrics = {
  logstash_cluster_events_input_rate: new _classes2.LogstashEventsRateClusterMetric({
    field: 'logstash_stats.events.in',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstash.eventsReceivedRateLabel', {
      defaultMessage: 'Events Received Rate'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstash.eventsReceivedRateDescription', {
      defaultMessage: 'Number of events received per second by all Logstash nodes at the inputs stage.'
    })
  }),
  logstash_cluster_events_output_rate: new _classes2.LogstashEventsRateClusterMetric({
    field: 'logstash_stats.events.out',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstash.eventsEmittedRateLabel', {
      defaultMessage: 'Events Emitted Rate'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstash.eventsEmittedRateDescription', {
      defaultMessage: 'Number of events emitted per second by all Logstash nodes at the outputs stage.'
    })
  }),
  logstash_cluster_events_latency: new _classes2.LogstashEventsLatencyClusterMetric({
    field: 'logstash_stats.events.out',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstash.eventLatencyLabel', {
      defaultMessage: 'Event Latency'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstash.eventLatencyDescription', {
      defaultMessage: 'Average time spent by events in the filter and output stages, which is the total ' + 'time it takes to process events divided by number of events emitted.'
    })
  }),
  logstash_events_input_rate: new _classes2.LogstashEventsRateMetric({
    field: 'logstash_stats.events.in',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.eventsReceivedRateLabel', {
      defaultMessage: 'Events Received Rate'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.eventsReceivedRateDescription', {
      defaultMessage: 'Number of events received per second by the Logstash node at the inputs stage.'
    })
  }),
  logstash_events_output_rate: new _classes2.LogstashEventsRateMetric({
    field: 'logstash_stats.events.out',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.eventsEmittedRateLabel', {
      defaultMessage: 'Events Emitted Rate'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.eventsEmittedRateDescription', {
      defaultMessage: 'Number of events emitted per second by the Logstash node at the outputs stage.'
    })
  }),
  logstash_events_latency: new _classes2.LogstashEventsLatencyMetric({
    field: 'logstash_stats.events.out',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.eventLatencyLabel', {
      defaultMessage: 'Event Latency'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.eventLatencyDescription', {
      defaultMessage: 'Average time spent by events in the filter and output stages, which is the total ' + 'time it takes to process events divided by number of events emitted.'
    })
  }),
  logstash_os_load_1m: new _classes2.LogstashMetric({
    title: instanceSystemLoadTitle,
    field: 'logstash_stats.os.cpu.load_average.1m',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.systemLoad.last1MinuteLabel', {
      defaultMessage: '1m'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.systemLoad.last1MinuteDescription', {
      defaultMessage: 'Load average over the last minute.'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  logstash_os_load_5m: new _classes2.LogstashMetric({
    title: instanceSystemLoadTitle,
    field: 'logstash_stats.os.cpu.load_average.5m',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.systemLoad.last5MinutesLabel', {
      defaultMessage: '5m'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.systemLoad.last5MinutesDescription', {
      defaultMessage: 'Load average over the last 5 minutes.'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  logstash_os_load_15m: new _classes2.LogstashMetric({
    title: instanceSystemLoadTitle,
    field: 'logstash_stats.os.cpu.load_average.15m',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.systemLoad.last15MinutesLabel', {
      defaultMessage: '15m'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.systemLoad.last15MinutesDescription', {
      defaultMessage: 'Load average over the last 15 minutes.'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  logstash_node_jvm_mem_max_in_bytes: new _classes2.LogstashMetric({
    field: 'logstash_stats.jvm.mem.heap_max_in_bytes',
    title: instanceJvmHeapTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.jvmHeap.maxHeapLabel', {
      defaultMessage: 'Max Heap'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.jvmHeap.maxHeapDescription', {
      defaultMessage: 'Total heap available to Logstash running in the JVM.'
    }),
    format: _formatting.SMALL_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  logstash_node_jvm_mem_used_in_bytes: new _classes2.LogstashMetric({
    field: 'logstash_stats.jvm.mem.heap_used_in_bytes',
    title: instanceJvmHeapTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.jvmHeap.usedHeapLabel', {
      defaultMessage: 'Used Heap'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.jvmHeap.usedHeapDescription', {
      defaultMessage: 'Total heap used by Logstash running in the JVM.'
    }),
    format: _formatting.SMALL_BYTES,
    metricAgg: 'max',
    units: 'B'
  }),
  logstash_node_cpu_utilization: new _classes2.LogstashMetric({
    field: 'logstash_stats.process.cpu.percent',
    label: instanceCpuUtilizationLabel,
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cpuUtilizationDescription', {
      defaultMessage: 'Percentage of CPU usage reported by the OS (100% is the max).'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: '%'
  }),
  logstash_node_cgroup_periods: new _classes2.LogstashMetric({
    field: 'logstash_stats.os.cgroup.cpu.stat.number_of_elapsed_periods',
    title: instanceCgroupCfsStatsTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cgroupCfsStats.cgroupElapsedPeriodsLabel', {
      defaultMessage: 'Cgroup Elapsed Periods'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cgroupCfsStats.cgroupElapsedPeriodsDescription', {
      defaultMessage: 'The number of sampling periods from the Completely Fair Scheduler (CFS). Compare against the number of times throttled.'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    derivative: true,
    units: ''
  }),
  logstash_node_cgroup_throttled: new _classes2.LogstashMetric({
    field: 'logstash_stats.os.cgroup.cpu.stat.time_throttled_nanos',
    title: instanceCgroupCpuPerformanceTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cgroupCpuPerformance.cgroupThrottlingLabel', {
      defaultMessage: 'Cgroup Throttling'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cgroupCpuPerformance.cgroupThrottlingDescription', {
      defaultMessage: 'The amount of throttled time, reported in nanoseconds, of the Cgroup.'
    }),
    format: _formatting.LARGE_ABBREVIATED,
    metricAgg: 'max',
    derivative: true,
    units: nsTimeUnitLabel
  }),
  logstash_node_cgroup_throttled_count: new _classes2.LogstashMetric({
    field: 'logstash_stats.os.cgroup.cpu.stat.number_of_times_throttled',
    title: instanceCgroupCfsStatsTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cgroupCfsStats.cgroupThrottledCountLabel', {
      defaultMessage: 'Cgroup Throttled Count'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cgroupCfsStats.cgroupThrottledCountDescription', {
      defaultMessage: 'The number of times that the CPU was throttled by the Cgroup.'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    derivative: true,
    units: ''
  }),
  logstash_node_cgroup_usage: new _classes2.LogstashMetric({
    field: 'logstash_stats.os.cgroup.cpuacct.usage_nanos',
    title: instanceCgroupCpuPerformanceTitle,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cgroupCpuPerformance.cgroupUsageLabel', {
      defaultMessage: 'Cgroup Usage'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cgroupCpuPerformance.cgroupUsageDescription', {
      defaultMessage: 'The usage, reported in nanoseconds, of the Cgroup. Compare this with the throttling to discover issues.'
    }),
    format: _formatting.LARGE_ABBREVIATED,
    metricAgg: 'max',
    derivative: true,
    units: nsTimeUnitLabel
  }),
  ...(() => {
    // CGroup CPU Utilization Fields
    const quotaMetricConfig = {
      app: 'logstash',
      uuidField: 'logstash_stats.logstash.uuid',
      timestampField: 'logstash_stats.timestamp',
      fieldSource: 'logstash_stats.os.cgroup',
      usageField: 'cpuacct.usage_nanos',
      periodsField: 'cpu.stat.number_of_elapsed_periods',
      quotaField: 'cpu.cfs_quota_micros',
      field: 'logstash_stats.process.cpu.percent',
      // backup field if quota is not configured
      label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cpuUtilization.cgroupCpuUtilizationLabel', {
        defaultMessage: 'Cgroup CPU Utilization'
      }),
      description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cgroupCpuUtilizationDescription', {
        defaultMessage: 'CPU Usage time compared to the CPU quota shown in percentage. If CPU quotas are not set, then no data will be shown.'
      })
    };
    return {
      logstash_node_cgroup_quota: new _classes.QuotaMetric({ ...quotaMetricConfig,
        title: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.cpuUtilizationTitle', {
          defaultMessage: 'CPU Utilization'
        })
      }),
      logstash_node_cgroup_quota_as_cpu_utilization: new _classes.QuotaMetric({ ...quotaMetricConfig,
        label: instanceCpuUtilizationLabel //  override the "Cgroup CPU..." label

      })
    };
  })(),
  logstash_queue_events_count: new _classes2.LogstashMetric({
    field: 'logstash_stats.queue.events_count',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.eventsQueuedLabel', {
      defaultMessage: 'Events Queued'
    }),
    title: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.persistentQueueEventsTitle', {
      defaultMessage: 'Persistent Queue Events'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.eventsQueuedDescription', {
      defaultMessage: 'Average number of events in the persistent queue waiting to be processed by the filter and output stages.'
    }),
    format: _formatting.LARGE_FLOAT,
    metricAgg: 'max',
    units: ''
  }),
  logstash_pipeline_queue_size: new _classes2.LogstashPipelineQueueSizeMetric({
    field: 'logstash_stats.pipelines.queue.queue_size_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.queueSizeLabel', {
      defaultMessage: 'Queue Size'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.queueSizeDescription', {
      defaultMessage: 'Current size of all persistent queues in the Logstash pipelines on this node.'
    }),
    title: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.persistentQueueSizeTitle', {
      defaultMessage: 'Persistent Queue Size'
    }),
    format: _formatting.LARGE_BYTES,
    units: 'B'
  }),
  logstash_pipeline_max_queue_size: new _classes2.LogstashPipelineQueueSizeMetric({
    field: 'logstash_stats.pipelines.queue.max_queue_size_in_bytes',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.maxQueueSizeLabel', {
      defaultMessage: 'Max Queue Size'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.logstashInstance.maxQueueSizeDescription', {
      defaultMessage: 'Maximum size set for the persistent queues on this node.'
    }),
    format: _formatting.LARGE_BYTES,
    units: 'B'
  }),
  logstash_cluster_pipeline_throughput: new _classes2.LogstashPipelineThroughputMetric({
    field: 'logstash_stats.pipelines.events.out',
    label: pipelineThroughputLabel,
    description: pipelineThroughputDescription,
    format: _formatting.LARGE_FLOAT,
    units: eventsPerSecondUnitLabel
  }),
  logstash_node_pipeline_throughput: new _classes2.LogstashPipelineThroughputMetric({
    uuidField: 'logstash_stats.logstash.uuid',
    // TODO: add comment explaining why
    field: 'logstash_stats.pipelines.events.out',
    label: pipelineThroughputLabel,
    description: pipelineThroughputDescription,
    format: _formatting.LARGE_FLOAT,
    units: eventsPerSecondUnitLabel
  }),
  logstash_cluster_pipeline_nodes_count: new _classes2.LogstashPipelineNodeCountMetric({
    field: 'logstash_stats.logstash.uuid',
    label: pipelineNodeCountLabel,
    description: pipelineNodeCountDescription,
    format: _formatting.LARGE_FLOAT,
    units: ''
  }),
  logstash_node_pipeline_nodes_count: new _classes2.LogstashPipelineNodeCountMetric({
    uuidField: 'logstash_stats.logstash.uuid',
    // TODO: add comment explaining why
    field: 'logstash_stats.logstash.uuid',
    label: pipelineNodeCountLabel,
    description: pipelineNodeCountDescription,
    format: _formatting.LARGE_FLOAT,
    units: ''
  })
};
exports.metrics = metrics;