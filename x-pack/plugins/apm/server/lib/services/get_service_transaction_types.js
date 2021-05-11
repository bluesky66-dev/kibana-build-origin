"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceTransactionTypes = getServiceTransactionTypes;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _queries = require("../../../common/utils/queries");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceTransactionTypes({
  setup,
  serviceName,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_transaction_types', async () => {
    const {
      start,
      end,
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
            filter: [...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), {
              term: {
                [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
              }
            }, ...(0, _queries.rangeQuery)(start, end)]
          }
        },
        aggs: {
          types: {
            terms: {
              field: _elasticsearch_fieldnames.TRANSACTION_TYPE,
              size: 100
            }
          }
        }
      }
    };
    const {
      aggregations
    } = await apmEventClient.search(params);
    const transactionTypes = (aggregations === null || aggregations === void 0 ? void 0 : aggregations.types.buckets.map(bucket => bucket.key)) || [];
    return {
      transactionTypes
    };
  });
}