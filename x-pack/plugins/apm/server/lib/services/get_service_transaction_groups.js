"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceTransactionGroups = getServiceTransactionGroups;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _event_outcome = require("../../../common/event_outcome");

var _queries = require("../../../common/utils/queries");

var _with_apm_span = require("../../utils/with_apm_span");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _calculate_throughput = require("../helpers/calculate_throughput");

var _latency_aggregation_type = require("../helpers/latency_aggregation_type");

var _transaction_error_rate = require("../helpers/transaction_error_rate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceTransactionGroups({
  environment,
  serviceName,
  setup,
  searchAggregatedTransactions,
  transactionType,
  latencyAggregationType
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_transaction_groups', async () => {
    var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5;

    const {
      apmEventClient,
      start,
      end,
      esFilter
    } = setup;
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
              size: 500,
              order: {
                _count: 'desc'
              }
            },
            aggs: {
              transaction_group_total_duration: {
                sum: {
                  field
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
    });
    const totalDuration = (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.total_duration.value;
    const transactionGroups = (_response$aggregation2 = (_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.transaction_groups.buckets.map(bucket => {
      const errorRate = (0, _transaction_error_rate.calculateTransactionErrorPercentage)(bucket[_elasticsearch_fieldnames.EVENT_OUTCOME]);
      const transactionGroupTotalDuration = bucket.transaction_group_total_duration.value || 0;
      return {
        name: bucket.key,
        latency: (0, _latency_aggregation_type.getLatencyValue)({
          latencyAggregationType,
          aggregation: bucket.latency
        }),
        throughput: (0, _calculate_throughput.calculateThroughput)({
          start,
          end,
          value: bucket.doc_count
        }),
        errorRate,
        impact: totalDuration ? transactionGroupTotalDuration * 100 / totalDuration : 0
      };
    })) !== null && _response$aggregation2 !== void 0 ? _response$aggregation2 : [];
    return {
      transactionGroups: transactionGroups.map(transactionGroup => ({ ...transactionGroup,
        transactionType
      })),
      isAggregationAccurate: ((_response$aggregation4 = (_response$aggregation5 = response.aggregations) === null || _response$aggregation5 === void 0 ? void 0 : _response$aggregation5.transaction_groups.sum_other_doc_count) !== null && _response$aggregation4 !== void 0 ? _response$aggregation4 : 0) === 0
    };
  });
}