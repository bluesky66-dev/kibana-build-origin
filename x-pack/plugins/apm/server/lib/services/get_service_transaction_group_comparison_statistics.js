"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceTransactionGroupComparisonStatistics = getServiceTransactionGroupComparisonStatistics;

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _event_outcome = require("../../../common/event_outcome");

var _queries = require("../../../common/utils/queries");

var _with_apm_span = require("../../utils/with_apm_span");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _get_bucket_size = require("../helpers/get_bucket_size");

var _latency_aggregation_type = require("../helpers/latency_aggregation_type");

var _transaction_error_rate = require("../helpers/transaction_error_rate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceTransactionGroupComparisonStatistics({
  environment,
  serviceName,
  transactionNames,
  setup,
  numBuckets,
  searchAggregatedTransactions,
  transactionType,
  latencyAggregationType
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_transaction_group_comparison_statistics', async () => {
    var _response$aggregation, _response$aggregation2, _response$aggregation3;

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
    const field = (0, _aggregated_transactions.getTransactionDurationFieldForAggregatedTransactions)(searchAggregatedTransactions);
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
            }, ...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter]
          }
        },
        aggs: {
          total_duration: {
            sum: {
              field
            }
          },
          transaction_groups: {
            terms: {
              field: _elasticsearch_fieldnames.TRANSACTION_NAME,
              include: transactionNames,
              size: transactionNames.length
            },
            aggs: {
              transaction_group_total_duration: {
                sum: {
                  field
                }
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
                  throughput_rate: {
                    rate: {
                      unit: 'minute'
                    }
                  },
                  ...(0, _latency_aggregation_type.getLatencyAggregation)(latencyAggregationType, field),
                  [_elasticsearch_fieldnames.EVENT_OUTCOME]: {
                    terms: {
                      field: _elasticsearch_fieldnames.EVENT_OUTCOME,
                      include: [_event_outcome.EventOutcome.failure, _event_outcome.EventOutcome.success]
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    const buckets = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.transaction_groups.buckets) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
    const totalDuration = (_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.total_duration.value;
    return (0, _lodash.keyBy)(buckets.map(bucket => {
      const transactionName = bucket.key;
      const latency = bucket.timeseries.buckets.map(timeseriesBucket => ({
        x: timeseriesBucket.key,
        y: (0, _latency_aggregation_type.getLatencyValue)({
          latencyAggregationType,
          aggregation: timeseriesBucket.latency
        })
      }));
      const throughput = bucket.timeseries.buckets.map(timeseriesBucket => ({
        x: timeseriesBucket.key,
        y: timeseriesBucket.throughput_rate.value
      }));
      const errorRate = bucket.timeseries.buckets.map(timeseriesBucket => ({
        x: timeseriesBucket.key,
        y: (0, _transaction_error_rate.calculateTransactionErrorPercentage)(timeseriesBucket[_elasticsearch_fieldnames.EVENT_OUTCOME])
      }));
      const transactionGroupTotalDuration = bucket.transaction_group_total_duration.value || 0;
      return {
        transactionName,
        latency,
        throughput,
        errorRate,
        impact: totalDuration ? transactionGroupTotalDuration * 100 / totalDuration : 0
      };
    }), 'transactionName');
  });
}