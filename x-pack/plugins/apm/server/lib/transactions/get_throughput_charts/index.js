"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThroughputCharts = getThroughputCharts;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _queries = require("../../../../common/utils/queries");

var _aggregated_transactions = require("../../../lib/helpers/aggregated_transactions");

var _get_bucket_size = require("../../../lib/helpers/get_bucket_size");

var _with_apm_span = require("../../../utils/with_apm_span");

var _transform = require("./transform");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function searchThroughput({
  environment,
  serviceName,
  transactionType,
  transactionName,
  setup,
  searchAggregatedTransactions,
  intervalString
}) {
  const {
    esFilter,
    start,
    end,
    apmEventClient
  } = setup;
  const filter = [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }, {
    term: {
      [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
    }
  }, ...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter];

  if (transactionName) {
    filter.push({
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
      }
    });
  }

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
        throughput: {
          terms: {
            field: _elasticsearch_fieldnames.TRANSACTION_RESULT,
            missing: ''
          },
          aggs: {
            timeseries: {
              date_histogram: {
                field: '@timestamp',
                fixed_interval: intervalString,
                min_doc_count: 0,
                extended_bounds: {
                  min: start,
                  max: end
                }
              }
            }
          }
        }
      }
    }
  };
  return apmEventClient.search(params);
}

async function getThroughputCharts({
  environment,
  serviceName,
  transactionType,
  transactionName,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction_throughput_series', async () => {
    var _response$aggregation;

    const {
      bucketSize,
      intervalString
    } = (0, _get_bucket_size.getBucketSize)(setup);
    const response = await searchThroughput({
      environment,
      serviceName,
      transactionType,
      transactionName,
      setup,
      searchAggregatedTransactions,
      intervalString
    });
    return {
      throughputTimeseries: (0, _transform.getThroughputBuckets)({
        throughputResultBuckets: (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.throughput.buckets,
        bucketSize,
        setupTimeRange: setup
      })
    };
  });
}