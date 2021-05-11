"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatencyTimeseries = getLatencyTimeseries;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _queries = require("../../../../common/utils/queries");

var _aggregated_transactions = require("../../../lib/helpers/aggregated_transactions");

var _get_bucket_size = require("../../../lib/helpers/get_bucket_size");

var _with_apm_span = require("../../../utils/with_apm_span");

var _latency_aggregation_type = require("../../helpers/latency_aggregation_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function searchLatency({
  environment,
  serviceName,
  transactionType,
  transactionName,
  setup,
  searchAggregatedTransactions,
  latencyAggregationType
}) {
  const {
    esFilter,
    start,
    end,
    apmEventClient
  } = setup;
  const {
    intervalString
  } = (0, _get_bucket_size.getBucketSize)({
    start,
    end
  });
  const filter = [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }, ...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter];

  if (transactionName) {
    filter.push({
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
      }
    });
  }

  if (transactionType) {
    filter.push({
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
      }
    });
  }

  const transactionDurationField = (0, _aggregated_transactions.getTransactionDurationFieldForAggregatedTransactions)(searchAggregatedTransactions);
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
        latencyTimeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: start,
              max: end
            }
          },
          aggs: (0, _latency_aggregation_type.getLatencyAggregation)(latencyAggregationType, transactionDurationField)
        },
        overall_avg_duration: {
          avg: {
            field: transactionDurationField
          }
        }
      }
    }
  };
  return apmEventClient.search(params);
}

function getLatencyTimeseries({
  environment,
  serviceName,
  transactionType,
  transactionName,
  setup,
  searchAggregatedTransactions,
  latencyAggregationType
}) {
  return (0, _with_apm_span.withApmSpan)('get_latency_charts', async () => {
    const response = await searchLatency({
      environment,
      serviceName,
      transactionType,
      transactionName,
      setup,
      searchAggregatedTransactions,
      latencyAggregationType
    });

    if (!response.aggregations) {
      return {
        latencyTimeseries: [],
        overallAvgDuration: null
      };
    }

    return {
      overallAvgDuration: response.aggregations.overall_avg_duration.value || null,
      latencyTimeseries: response.aggregations.latencyTimeseries.buckets.map(bucket => {
        return {
          x: bucket.key,
          y: (0, _latency_aggregation_type.getLatencyValue)({
            latencyAggregationType,
            aggregation: bucket.latency
          })
        };
      })
    };
  });
}