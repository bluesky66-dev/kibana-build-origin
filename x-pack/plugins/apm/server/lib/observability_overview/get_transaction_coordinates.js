"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionCoordinates = getTransactionCoordinates;

var _queries = require("../../../common/utils/queries");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _calculate_throughput = require("../helpers/calculate_throughput");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getTransactionCoordinates({
  setup,
  bucketSize,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('observability_overview_get_transaction_distribution', async () => {
    const {
      apmEventClient,
      start,
      end
    } = setup;
    const {
      aggregations
    } = await apmEventClient.search({
      apm: {
        events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions)]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: (0, _queries.rangeQuery)(start, end)
          }
        },
        aggs: {
          distribution: {
            date_histogram: {
              field: '@timestamp',
              fixed_interval: bucketSize,
              min_doc_count: 0
            }
          }
        }
      }
    });
    return (aggregations === null || aggregations === void 0 ? void 0 : aggregations.distribution.buckets.map(bucket => ({
      x: bucket.key,
      y: (0, _calculate_throughput.calculateThroughput)({
        start,
        end,
        value: bucket.doc_count
      })
    }))) || [];
  });
}