"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceMapServiceNodeInfo = getServiceMapServiceNodeInfo;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../common/processor_event");

var _transaction_types = require("../../../common/transaction_types");

var _queries = require("../../../common/utils/queries");

var _with_apm_span = require("../../utils/with_apm_span");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _memory = require("../metrics/by_agent/shared/memory");

var _get_error_rate = require("../transaction_groups/get_error_rate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceMapServiceNodeInfo({
  environment,
  serviceName,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_map_node_stats', async () => {
    const {
      start,
      end
    } = setup;
    const filter = [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment)];
    const minutes = Math.abs((end - start) / (1000 * 60));
    const taskParams = {
      environment,
      filter,
      searchAggregatedTransactions,
      minutes,
      serviceName,
      setup
    };
    const [errorStats, transactionStats, cpuStats, memoryStats] = await Promise.all([getErrorStats(taskParams), getTransactionStats(taskParams), getCpuStats(taskParams), getMemoryStats(taskParams)]);
    return { ...errorStats,
      transactionStats,
      ...cpuStats,
      ...memoryStats
    };
  });
}

async function getErrorStats({
  setup,
  serviceName,
  environment,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_error_rate_for_service_map_node', async () => {
    const {
      noHits,
      average
    } = await (0, _get_error_rate.getErrorRate)({
      environment,
      setup,
      serviceName,
      searchAggregatedTransactions
    });
    return {
      avgErrorRate: noHits ? null : average
    };
  });
}

function getTransactionStats({
  setup,
  filter,
  minutes,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction_stats_for_service_map_node', async () => {
    var _response$aggregation, _response$aggregation2;

    const {
      apmEventClient
    } = setup;
    const params = {
      apm: {
        events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions)]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [...filter, ...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), {
              terms: {
                [_elasticsearch_fieldnames.TRANSACTION_TYPE]: [_transaction_types.TRANSACTION_REQUEST, _transaction_types.TRANSACTION_PAGE_LOAD]
              }
            }]
          }
        },
        track_total_hits: true,
        aggs: {
          duration: {
            avg: {
              field: (0, _aggregated_transactions.getTransactionDurationFieldForAggregatedTransactions)(searchAggregatedTransactions)
            }
          }
        }
      }
    };
    const response = await apmEventClient.search(params);
    const totalRequests = response.hits.total.value;
    return {
      avgTransactionDuration: (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.duration.value) !== null && _response$aggregation !== void 0 ? _response$aggregation : null,
      avgRequestsPerMinute: totalRequests > 0 ? totalRequests / minutes : null
    };
  });
}

function getCpuStats({
  setup,
  filter
}) {
  return (0, _with_apm_span.withApmSpan)('get_avg_cpu_usage_for_service_map_node', async () => {
    var _response$aggregation3, _response$aggregation4;

    const {
      apmEventClient
    } = setup;
    const response = await apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.metric]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [...filter, {
              exists: {
                field: _elasticsearch_fieldnames.METRIC_SYSTEM_CPU_PERCENT
              }
            }]
          }
        },
        aggs: {
          avgCpuUsage: {
            avg: {
              field: _elasticsearch_fieldnames.METRIC_SYSTEM_CPU_PERCENT
            }
          }
        }
      }
    });
    return {
      avgCpuUsage: (_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.avgCpuUsage.value) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : null
    };
  });
}

function getMemoryStats({
  setup,
  filter
}) {
  return (0, _with_apm_span.withApmSpan)('get_memory_stats_for_service_map_node', async () => {
    const {
      apmEventClient
    } = setup;

    const getAvgMemoryUsage = ({
      additionalFilters,
      script
    }) => {
      return (0, _with_apm_span.withApmSpan)('get_avg_memory_for_service_map_node', async () => {
        var _response$aggregation5, _response$aggregation6;

        const response = await apmEventClient.search({
          apm: {
            events: [_processor_event.ProcessorEvent.metric]
          },
          body: {
            size: 0,
            query: {
              bool: {
                filter: [...filter, ...additionalFilters]
              }
            },
            aggs: {
              avgMemoryUsage: {
                avg: {
                  script
                }
              }
            }
          }
        });
        return (_response$aggregation5 = (_response$aggregation6 = response.aggregations) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.avgMemoryUsage.value) !== null && _response$aggregation5 !== void 0 ? _response$aggregation5 : null;
      });
    };

    let avgMemoryUsage = await getAvgMemoryUsage({
      additionalFilters: [{
        exists: {
          field: _elasticsearch_fieldnames.METRIC_CGROUP_MEMORY_USAGE_BYTES
        }
      }],
      script: _memory.percentCgroupMemoryUsedScript
    });

    if (!avgMemoryUsage) {
      avgMemoryUsage = await getAvgMemoryUsage({
        additionalFilters: [{
          exists: {
            field: _elasticsearch_fieldnames.METRIC_SYSTEM_FREE_MEMORY
          }
        }, {
          exists: {
            field: _elasticsearch_fieldnames.METRIC_SYSTEM_TOTAL_MEMORY
          }
        }],
        script: _memory.percentSystemMemoryUsedScript
      });
    }

    return {
      avgMemoryUsage
    };
  });
}