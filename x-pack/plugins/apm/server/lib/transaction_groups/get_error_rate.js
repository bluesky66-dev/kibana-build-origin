"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorRate = getErrorRate;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _event_outcome = require("../../../common/event_outcome");

var _queries = require("../../../common/utils/queries");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _get_bucket_size = require("../helpers/get_bucket_size");

var _transaction_error_rate = require("../helpers/transaction_error_rate");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getErrorRate({
  environment,
  serviceName,
  transactionType,
  transactionName,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction_group_error_rate', async () => {
    const {
      start,
      end,
      esFilter,
      apmEventClient
    } = setup;
    const transactionNamefilter = transactionName ? [{
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
      }
    }] : [];
    const transactionTypefilter = transactionType ? [{
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
      }
    }] : [];
    const filter = [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }, {
      terms: {
        [_elasticsearch_fieldnames.EVENT_OUTCOME]: [_event_outcome.EventOutcome.failure, _event_outcome.EventOutcome.success]
      }
    }, ...transactionNamefilter, ...transactionTypefilter, ...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter];
    const outcomes = (0, _transaction_error_rate.getOutcomeAggregation)();
    const params = {
      apm: {
        events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions)]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter
          }
        },
        aggs: {
          outcomes,
          timeseries: {
            date_histogram: {
              field: '@timestamp',
              fixed_interval: (0, _get_bucket_size.getBucketSize)({
                start,
                end
              }).intervalString,
              min_doc_count: 0,
              extended_bounds: {
                min: start,
                max: end
              }
            },
            aggs: {
              outcomes
            }
          }
        }
      }
    };
    const resp = await apmEventClient.search(params);
    const noHits = resp.hits.total.value === 0;

    if (!resp.aggregations) {
      return {
        noHits,
        transactionErrorRate: [],
        average: null
      };
    }

    const transactionErrorRate = (0, _transaction_error_rate.getTransactionErrorRateTimeSeries)(resp.aggregations.timeseries.buckets);
    const average = (0, _transaction_error_rate.calculateTransactionErrorPercentage)(resp.aggregations.outcomes);
    return {
      noHits,
      transactionErrorRate,
      average
    };
  });
}