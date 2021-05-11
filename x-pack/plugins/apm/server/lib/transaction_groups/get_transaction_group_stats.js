"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAverages = getAverages;
exports.getCounts = getCounts;
exports.getSums = getSums;
exports.getPercentiles = getPercentiles;

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _array_union_to_callable = require("../../../common/utils/array_union_to_callable");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function mergeRequestWithAggs(request, aggs) {
  return (0, _lodash.merge)({}, request, {
    body: {
      aggs: {
        transaction_groups: {
          aggs
        }
      }
    }
  });
}

function getAverages({
  request,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_avg_transaction_group_duration', async () => {
    var _response$aggregation, _response$aggregation2;

    const params = mergeRequestWithAggs(request, {
      avg: {
        avg: {
          field: (0, _aggregated_transactions.getTransactionDurationFieldForAggregatedTransactions)(searchAggregatedTransactions)
        }
      }
    });
    const response = await setup.apmEventClient.search(params);
    return (0, _array_union_to_callable.arrayUnionToCallable)((_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.transaction_groups.buckets) !== null && _response$aggregation !== void 0 ? _response$aggregation : []).map(bucket => {
      return {
        key: bucket.key,
        avg: bucket.avg.value
      };
    });
  });
}

function getCounts({
  request,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction_group_transaction_count', async () => {
    var _response$aggregation3, _response$aggregation4;

    const params = mergeRequestWithAggs(request, {
      transaction_type: {
        top_metrics: {
          sort: {
            '@timestamp': 'desc'
          },
          metrics: {
            field: _elasticsearch_fieldnames.TRANSACTION_TYPE
          }
        }
      }
    });
    const response = await setup.apmEventClient.search(params);
    return (0, _array_union_to_callable.arrayUnionToCallable)((_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.transaction_groups.buckets) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : []).map(bucket => {
      return {
        key: bucket.key,
        count: bucket.doc_count,
        transactionType: bucket.transaction_type.top[0].metrics[_elasticsearch_fieldnames.TRANSACTION_TYPE]
      };
    });
  });
}

function getSums({
  request,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction_group_latency_sums', async () => {
    var _response$aggregation5, _response$aggregation6;

    const params = mergeRequestWithAggs(request, {
      sum: {
        sum: {
          field: (0, _aggregated_transactions.getTransactionDurationFieldForAggregatedTransactions)(searchAggregatedTransactions)
        }
      }
    });
    const response = await setup.apmEventClient.search(params);
    return (0, _array_union_to_callable.arrayUnionToCallable)((_response$aggregation5 = (_response$aggregation6 = response.aggregations) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.transaction_groups.buckets) !== null && _response$aggregation5 !== void 0 ? _response$aggregation5 : []).map(bucket => {
      return {
        key: bucket.key,
        sum: bucket.sum.value
      };
    });
  });
}

function getPercentiles({
  request,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction_group_latency_percentiles', async () => {
    var _response$aggregation7, _response$aggregation8;

    const params = mergeRequestWithAggs(request, {
      p95: {
        percentiles: {
          field: (0, _aggregated_transactions.getTransactionDurationFieldForAggregatedTransactions)(searchAggregatedTransactions),
          hdr: {
            number_of_significant_value_digits: 2
          },
          percents: [95]
        }
      }
    });
    const response = await setup.apmEventClient.search(params);
    return (0, _array_union_to_callable.arrayUnionToCallable)((_response$aggregation7 = (_response$aggregation8 = response.aggregations) === null || _response$aggregation8 === void 0 ? void 0 : _response$aggregation8.transaction_groups.buckets) !== null && _response$aggregation7 !== void 0 ? _response$aggregation7 : []).map(bucket => {
      return {
        key: bucket.key,
        p95: Object.values(bucket.p95.values)[0]
      };
    });
  });
}