"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThroughput = getThroughput;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _queries = require("../../../common/utils/queries");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _get_bucket_size = require("../helpers/get_bucket_size");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function fetcher({
  environment,
  searchAggregatedTransactions,
  serviceName,
  setup,
  transactionType,
  start,
  end
}) {
  const {
    esFilter,
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
  }, {
    term: {
      [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
    }
  }, ...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter];
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
            throughput: {
              rate: {
                unit: 'minute'
              }
            }
          }
        }
      }
    }
  };
  return apmEventClient.search(params);
}

function getThroughput(options) {
  return (0, _with_apm_span.withApmSpan)('get_throughput_for_service', async () => {
    var _response$aggregation, _response$aggregation2;

    const response = await fetcher(options);
    return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.timeseries.buckets.map(bucket => {
      return {
        x: bucket.key,
        y: bucket.throughput.value
      };
    })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  });
}