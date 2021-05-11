"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHasAggregatedTransactions = getHasAggregatedTransactions;
exports.getSearchAggregatedTransactions = getSearchAggregatedTransactions;
exports.getTransactionDurationFieldForAggregatedTransactions = getTransactionDurationFieldForAggregatedTransactions;
exports.getDocumentTypeFilterForAggregatedTransactions = getDocumentTypeFilterForAggregatedTransactions;
exports.getProcessorEventForAggregatedTransactions = getProcessorEventForAggregatedTransactions;

var _aggregated_transactions = require("../../../../common/aggregated_transactions");

var _queries = require("../../../../common/utils/queries");

var _processor_event = require("../../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getHasAggregatedTransactions({
  start,
  end,
  apmEventClient
}) {
  return (0, _with_apm_span.withApmSpan)('get_has_aggregated_transactions', async () => {
    const response = await apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.metric]
      },
      body: {
        query: {
          bool: {
            filter: [{
              exists: {
                field: _elasticsearch_fieldnames.TRANSACTION_DURATION_HISTOGRAM
              }
            }, ...(start && end ? (0, _queries.rangeQuery)(start, end) : [])]
          }
        }
      },
      terminateAfter: 1
    });

    if (response.hits.total.value > 0) {
      return true;
    }

    return false;
  });
}

async function getSearchAggregatedTransactions({
  config,
  start,
  end,
  apmEventClient
}) {
  const searchAggregatedTransactions = config['xpack.apm.searchAggregatedTransactions'];

  if (searchAggregatedTransactions === _aggregated_transactions.SearchAggregatedTransactionSetting.auto) {
    return getHasAggregatedTransactions({
      start,
      end,
      apmEventClient
    });
  }

  return searchAggregatedTransactions === _aggregated_transactions.SearchAggregatedTransactionSetting.always;
}

function getTransactionDurationFieldForAggregatedTransactions(searchAggregatedTransactions) {
  return searchAggregatedTransactions ? _elasticsearch_fieldnames.TRANSACTION_DURATION_HISTOGRAM : _elasticsearch_fieldnames.TRANSACTION_DURATION;
}

function getDocumentTypeFilterForAggregatedTransactions(searchAggregatedTransactions) {
  return searchAggregatedTransactions ? [{
    exists: {
      field: _elasticsearch_fieldnames.TRANSACTION_DURATION_HISTOGRAM
    }
  }] : [];
}

function getProcessorEventForAggregatedTransactions(searchAggregatedTransactions) {
  return searchAggregatedTransactions ? _processor_event.ProcessorEvent.metric : _processor_event.ProcessorEvent.transaction;
}