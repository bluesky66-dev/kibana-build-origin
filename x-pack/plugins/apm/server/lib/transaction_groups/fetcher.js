"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transactionGroupsFetcher = transactionGroupsFetcher;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _join_by_key = require("../../../common/utils/join_by_key");

var _transaction_groups = require("../../projections/transaction_groups");

var _merge_projection = require("../../projections/util/merge_projection");

var _with_apm_span = require("../../utils/with_apm_span");

var _get_transaction_group_stats = require("./get_transaction_group_stats");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getItemsWithRelativeImpact(setup, items) {
  const values = items.map(({
    sum
  }) => sum).filter(value => value !== null);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const duration = _moment.default.duration(setup.end - setup.start);

  const minutes = duration.asMinutes();
  const itemsWithRelativeImpact = items.map(item => {
    var _item$count;

    return {
      key: item.key,
      averageResponseTime: item.avg,
      transactionsPerMinute: ((_item$count = item.count) !== null && _item$count !== void 0 ? _item$count : 0) / minutes,
      transactionType: item.transactionType || '',
      impact: item.sum !== null && item.sum !== undefined ? (item.sum - min) / (max - min) * 100 || 0 : 0,
      p95: item.p95
    };
  });
  return itemsWithRelativeImpact;
}

function transactionGroupsFetcher(options, setup, bucketSize) {
  const spanName = options.type === 'top_traces' ? 'get_top_traces' : 'get_top_transactions';
  return (0, _with_apm_span.withApmSpan)(spanName, async () => {
    const projection = (0, _transaction_groups.getTransactionGroupsProjection)({
      setup,
      options
    });
    const isTopTraces = options.type === 'top_traces'; // @ts-expect-error

    delete projection.body.aggs; // traces overview is hardcoded to 10000
    // transactions overview: 1 extra bucket is added to check whether the total number of buckets exceed the specified bucket size.

    const expectedBucketSize = isTopTraces ? 10000 : bucketSize;
    const size = isTopTraces ? 10000 : expectedBucketSize + 1;
    const request = (0, _merge_projection.mergeProjection)(projection, {
      body: {
        size: 0,
        aggs: {
          transaction_groups: { ...(isTopTraces ? {
              composite: {
                sources: [{
                  [_elasticsearch_fieldnames.SERVICE_NAME]: {
                    terms: {
                      field: _elasticsearch_fieldnames.SERVICE_NAME
                    }
                  }
                }, {
                  [_elasticsearch_fieldnames.TRANSACTION_NAME]: {
                    terms: {
                      field: _elasticsearch_fieldnames.TRANSACTION_NAME
                    }
                  }
                }],
                size
              }
            } : {
              terms: {
                field: _elasticsearch_fieldnames.TRANSACTION_NAME,
                size
              }
            })
          }
        }
      }
    });
    const params = {
      request,
      setup,
      searchAggregatedTransactions: options.searchAggregatedTransactions
    };
    const [counts, averages, sums, percentiles] = await Promise.all([(0, _get_transaction_group_stats.getCounts)(params), (0, _get_transaction_group_stats.getAverages)(params), (0, _get_transaction_group_stats.getSums)(params), !isTopTraces ? (0, _get_transaction_group_stats.getPercentiles)(params) : Promise.resolve(undefined)]);
    const stats = [...averages, ...counts, ...sums, ...(percentiles ? percentiles : [])];
    const items = (0, _join_by_key.joinByKey)(stats, 'key');
    const itemsWithRelativeImpact = getItemsWithRelativeImpact(setup, items);
    const defaultServiceName = options.type === 'top_transactions' ? options.serviceName : undefined;
    const itemsWithKeys = itemsWithRelativeImpact.map(item => {
      let transactionName;
      let serviceName;

      if (typeof item.key === 'string') {
        transactionName = item.key;
        serviceName = defaultServiceName;
      } else {
        transactionName = item.key[_elasticsearch_fieldnames.TRANSACTION_NAME];
        serviceName = item.key[_elasticsearch_fieldnames.SERVICE_NAME];
      }

      return { ...item,
        transactionName,
        serviceName
      };
    });
    return {
      items: (0, _lodash.take)( // sort by impact by default so most impactful services are not cut off
      (0, _lodash.sortBy)(itemsWithKeys, 'impact').reverse(), bucketSize),
      // The aggregation is considered accurate if the configured bucket size is larger or equal to the number of buckets returned
      // the actual number of buckets retrieved are `bucketsize + 1` to detect whether it's above the limit
      isAggregationAccurate: expectedBucketSize >= itemsWithRelativeImpact.length,
      bucketSize
    };
  });
}