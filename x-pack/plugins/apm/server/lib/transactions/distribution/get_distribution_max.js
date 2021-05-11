"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDistributionMax = getDistributionMax;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _aggregated_transactions = require("../../helpers/aggregated_transactions");

var _queries = require("../../../../common/utils/queries");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getDistributionMax({
  environment,
  serviceName,
  transactionName,
  transactionType,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_latency_distribution_max', async () => {
    var _resp$aggregations$st, _resp$aggregations;

    const {
      start,
      end,
      esFilter,
      apmEventClient
    } = setup;
    const params = {
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
            }, {
              term: {
                [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
              }
            }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter]
          }
        },
        aggs: {
          stats: {
            max: {
              field: (0, _aggregated_transactions.getTransactionDurationFieldForAggregatedTransactions)(searchAggregatedTransactions)
            }
          }
        }
      }
    };
    const resp = await apmEventClient.search(params);
    return (_resp$aggregations$st = (_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.stats.value) !== null && _resp$aggregations$st !== void 0 ? _resp$aggregations$st : null;
  });
}