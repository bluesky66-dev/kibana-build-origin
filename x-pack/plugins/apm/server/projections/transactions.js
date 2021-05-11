"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionsProjection = getTransactionsProjection;

var _elasticsearch_fieldnames = require("../../common/elasticsearch_fieldnames");

var _queries = require("../../common/utils/queries");

var _aggregated_transactions = require("../lib/helpers/aggregated_transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getTransactionsProjection({
  environment,
  setup,
  serviceName,
  transactionName,
  transactionType,
  searchAggregatedTransactions
}) {
  const {
    start,
    end,
    esFilter
  } = setup;
  const transactionNameFilter = transactionName ? [{
    term: {
      [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
    }
  }] : [];
  const transactionTypeFilter = transactionType ? [{
    term: {
      [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
    }
  }] : [];
  const serviceNameFilter = serviceName ? [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }] : [];
  const bool = {
    filter: [...serviceNameFilter, ...transactionNameFilter, ...transactionTypeFilter, ...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter]
  };
  return {
    apm: {
      events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions)]
    },
    body: {
      query: {
        bool
      }
    }
  };
}