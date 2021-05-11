"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceInstanceTransactionStats = getServiceInstanceTransactionStats;

var _event_outcome = require("../../../../common/event_outcome");

var _queries = require("../../../../common/utils/queries");

var _service_nodes = require("../../../../common/service_nodes");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _aggregated_transactions = require("../../helpers/aggregated_transactions");

var _calculate_throughput = require("../../helpers/calculate_throughput");

var _with_apm_span = require("../../../utils/with_apm_span");

var _latency_aggregation_type = require("../../helpers/latency_aggregation_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceInstanceTransactionStats({
  environment,
  latencyAggregationType,
  setup,
  transactionType,
  serviceName,
  size,
  searchAggregatedTransactions,
  numBuckets
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_instance_transaction_stats', async () => {
    var _response$aggregation, _response$aggregation2;

    const {
      apmEventClient,
      start,
      end,
      esFilter
    } = setup;
    const {
      intervalString,
      bucketSize
    } = (0, _get_bucket_size.getBucketSize)({
      start,
      end,
      numBuckets
    });
    const field = (0, _aggregated_transactions.getTransactionDurationFieldForAggregatedTransactions)(searchAggregatedTransactions);
    const subAggs = { ...(0, _latency_aggregation_type.getLatencyAggregation)(latencyAggregationType, field),
      failures: {
        filter: {
          term: {
            [_elasticsearch_fieldnames.EVENT_OUTCOME]: _event_outcome.EventOutcome.failure
          }
        }
      }
    };
    const response = await apmEventClient.search({
      apm: {
        events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions)]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
              }
            }, {
              term: {
                [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
              }
            }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter]
          }
        },
        aggs: {
          [_elasticsearch_fieldnames.SERVICE_NODE_NAME]: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_NODE_NAME,
              missing: _service_nodes.SERVICE_NODE_NAME_MISSING,
              size
            },
            aggs: { ...subAggs,
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
                aggs: { ...subAggs
                }
              }
            }
          }
        }
      }
    });
    const bucketSizeInMinutes = bucketSize / 60;
    return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2[_elasticsearch_fieldnames.SERVICE_NODE_NAME].buckets.map(serviceNodeBucket => {
      const {
        doc_count: count,
        latency,
        key,
        failures,
        timeseries
      } = serviceNodeBucket;
      return {
        serviceNodeName: String(key),
        errorRate: {
          value: failures.doc_count / count,
          timeseries: timeseries.buckets.map(dateBucket => ({
            x: dateBucket.key,
            y: dateBucket.failures.doc_count / dateBucket.doc_count
          }))
        },
        throughput: {
          value: (0, _calculate_throughput.calculateThroughput)({
            start,
            end,
            value: count
          }),
          timeseries: timeseries.buckets.map(dateBucket => ({
            x: dateBucket.key,
            y: dateBucket.doc_count / bucketSizeInMinutes
          }))
        },
        latency: {
          value: (0, _latency_aggregation_type.getLatencyValue)({
            aggregation: latency,
            latencyAggregationType
          }),
          timeseries: timeseries.buckets.map(dateBucket => ({
            x: dateBucket.key,
            y: (0, _latency_aggregation_type.getLatencyValue)({
              aggregation: dateBucket.latency,
              latencyAggregationType
            })
          }))
        }
      };
    })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  });
}