"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceTransactionStats = getServiceTransactionStats;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _transaction_types = require("../../../../common/transaction_types");

var _queries = require("../../../../common/utils/queries");

var _aggregated_transactions = require("../../helpers/aggregated_transactions");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _calculate_throughput = require("../../helpers/calculate_throughput");

var _transaction_error_rate = require("../../helpers/transaction_error_rate");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceTransactionStats({
  environment,
  setup,
  searchAggregatedTransactions,
  maxNumServices
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_transaction_stats', async () => {
    var _response$aggregation, _response$aggregation2;

    const {
      apmEventClient,
      start,
      end,
      esFilter
    } = setup;
    const outcomes = (0, _transaction_error_rate.getOutcomeAggregation)();
    const metrics = {
      avg_duration: {
        avg: {
          field: (0, _aggregated_transactions.getTransactionDurationFieldForAggregatedTransactions)(searchAggregatedTransactions)
        }
      },
      outcomes
    };
    const response = await apmEventClient.search({
      apm: {
        events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions)]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter]
          }
        },
        aggs: {
          services: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_NAME,
              size: maxNumServices
            },
            aggs: {
              transactionType: {
                terms: {
                  field: _elasticsearch_fieldnames.TRANSACTION_TYPE
                },
                aggs: { ...metrics,
                  environments: {
                    terms: {
                      field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
                    }
                  },
                  sample: {
                    top_metrics: {
                      metrics: {
                        field: _elasticsearch_fieldnames.AGENT_NAME
                      },
                      sort: {
                        '@timestamp': 'desc'
                      }
                    }
                  },
                  timeseries: {
                    date_histogram: {
                      field: '@timestamp',
                      fixed_interval: (0, _get_bucket_size.getBucketSize)({
                        start,
                        end,
                        numBuckets: 20
                      }).intervalString,
                      min_doc_count: 0,
                      extended_bounds: {
                        min: start,
                        max: end
                      }
                    },
                    aggs: metrics
                  }
                }
              }
            }
          }
        }
      }
    });
    return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.services.buckets.map(bucket => {
      var _bucket$transactionTy;

      const topTransactionTypeBucket = (_bucket$transactionTy = bucket.transactionType.buckets.find(({
        key
      }) => key === _transaction_types.TRANSACTION_REQUEST || key === _transaction_types.TRANSACTION_PAGE_LOAD)) !== null && _bucket$transactionTy !== void 0 ? _bucket$transactionTy : bucket.transactionType.buckets[0];
      return {
        serviceName: bucket.key,
        transactionType: topTransactionTypeBucket.key,
        environments: topTransactionTypeBucket.environments.buckets.map(environmentBucket => environmentBucket.key),
        agentName: topTransactionTypeBucket.sample.top[0].metrics[_elasticsearch_fieldnames.AGENT_NAME],
        avgResponseTime: {
          value: topTransactionTypeBucket.avg_duration.value,
          timeseries: topTransactionTypeBucket.timeseries.buckets.map(dateBucket => ({
            x: dateBucket.key,
            y: dateBucket.avg_duration.value
          }))
        },
        transactionErrorRate: {
          value: (0, _transaction_error_rate.calculateTransactionErrorPercentage)(topTransactionTypeBucket.outcomes),
          timeseries: topTransactionTypeBucket.timeseries.buckets.map(dateBucket => ({
            x: dateBucket.key,
            y: (0, _transaction_error_rate.calculateTransactionErrorPercentage)(dateBucket.outcomes)
          }))
        },
        transactionsPerMinute: {
          value: (0, _calculate_throughput.calculateThroughput)({
            start,
            end,
            value: topTransactionTypeBucket.doc_count
          }),
          timeseries: topTransactionTypeBucket.timeseries.buckets.map(dateBucket => ({
            x: dateBucket.key,
            y: (0, _calculate_throughput.calculateThroughput)({
              start,
              end,
              value: dateBucket.doc_count
            })
          }))
        }
      };
    })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  });
}