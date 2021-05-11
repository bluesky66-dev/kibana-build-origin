"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceInstanceSystemMetricStats = getServiceInstanceSystemMetricStats;

var _queries = require("../../../../common/utils/queries");

var _service_nodes = require("../../../../common/service_nodes");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _memory = require("../../metrics/by_agent/shared/memory");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceInstanceSystemMetricStats({
  environment,
  setup,
  serviceName,
  size,
  numBuckets
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_instance_system_metric_stats', async () => {
    var _response$aggregation, _response$aggregation2;

    const {
      apmEventClient,
      start,
      end,
      esFilter
    } = setup;
    const {
      intervalString
    } = (0, _get_bucket_size.getBucketSize)({
      start,
      end,
      numBuckets
    });
    const systemMemoryFilter = {
      bool: {
        filter: [{
          exists: {
            field: _elasticsearch_fieldnames.METRIC_SYSTEM_FREE_MEMORY
          }
        }, {
          exists: {
            field: _elasticsearch_fieldnames.METRIC_SYSTEM_TOTAL_MEMORY
          }
        }]
      }
    };
    const cgroupMemoryFilter = {
      exists: {
        field: _elasticsearch_fieldnames.METRIC_CGROUP_MEMORY_USAGE_BYTES
      }
    };
    const cpuUsageFilter = {
      exists: {
        field: _elasticsearch_fieldnames.METRIC_PROCESS_CPU_PERCENT
      }
    };

    function withTimeseries(agg) {
      return {
        avg: {
          avg: agg
        },
        timeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: start,
              max: end
            }
          },
          aggs: {
            avg: {
              avg: agg
            }
          }
        }
      };
    }

    const subAggs = {
      memory_usage_cgroup: {
        filter: cgroupMemoryFilter,
        aggs: withTimeseries({
          script: _memory.percentCgroupMemoryUsedScript
        })
      },
      memory_usage_system: {
        filter: systemMemoryFilter,
        aggs: withTimeseries({
          script: _memory.percentSystemMemoryUsedScript
        })
      },
      cpu_usage: {
        filter: cpuUsageFilter,
        aggs: withTimeseries({
          field: _elasticsearch_fieldnames.METRIC_PROCESS_CPU_PERCENT
        })
      }
    };
    const response = await apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.metric]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
              }
            }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter],
            should: [cgroupMemoryFilter, systemMemoryFilter, cpuUsageFilter],
            minimum_should_match: 1
          }
        },
        aggs: {
          [_elasticsearch_fieldnames.SERVICE_NODE_NAME]: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_NODE_NAME,
              missing: _service_nodes.SERVICE_NODE_NAME_MISSING,
              size
            },
            aggs: subAggs
          }
        }
      }
    });
    return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2[_elasticsearch_fieldnames.SERVICE_NODE_NAME].buckets.map(serviceNodeBucket => {
      const hasCGroupData = serviceNodeBucket.memory_usage_cgroup.avg.value !== null;
      const memoryMetricsKey = hasCGroupData ? 'memory_usage_cgroup' : 'memory_usage_system';
      return {
        serviceNodeName: String(serviceNodeBucket.key),
        cpuUsage: {
          value: serviceNodeBucket.cpu_usage.avg.value,
          timeseries: serviceNodeBucket.cpu_usage.timeseries.buckets.map(dateBucket => ({
            x: dateBucket.key,
            y: dateBucket.avg.value
          }))
        },
        memoryUsage: {
          value: serviceNodeBucket[memoryMetricsKey].avg.value,
          timeseries: serviceNodeBucket[memoryMetricsKey].timeseries.buckets.map(dateBucket => ({
            x: dateBucket.key,
            y: dateBucket.avg.value
          }))
        }
      };
    })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  });
}