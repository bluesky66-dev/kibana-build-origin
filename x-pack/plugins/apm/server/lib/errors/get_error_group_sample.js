"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorGroupSample = getErrorGroupSample;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../common/processor_event");

var _queries = require("../../../common/utils/queries");

var _with_apm_span = require("../../utils/with_apm_span");

var _get_transaction = require("../transactions/get_transaction");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getErrorGroupSample({
  environment,
  serviceName,
  groupId,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_error_group_sample', async () => {
    var _resp$hits$hits$, _error$transaction, _error$trace;

    const {
      start,
      end,
      esFilter,
      apmEventClient
    } = setup;
    const params = {
      apm: {
        events: [_processor_event.ProcessorEvent.error]
      },
      body: {
        size: 1,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
              }
            }, {
              term: {
                [_elasticsearch_fieldnames.ERROR_GROUP_ID]: groupId
              }
            }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter],
            should: [{
              term: {
                [_elasticsearch_fieldnames.TRANSACTION_SAMPLED]: true
              }
            }]
          }
        },
        sort: [{
          _score: 'desc'
        }, // sort by _score first to ensure that errors with transaction.sampled:true ends up on top
        {
          '@timestamp': {
            order: 'desc'
          }
        } // sort by timestamp to get the most recent error
        ]
      }
    };
    const resp = await apmEventClient.search(params);
    const error = (_resp$hits$hits$ = resp.hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : _resp$hits$hits$._source;
    const transactionId = error === null || error === void 0 ? void 0 : (_error$transaction = error.transaction) === null || _error$transaction === void 0 ? void 0 : _error$transaction.id;
    const traceId = error === null || error === void 0 ? void 0 : (_error$trace = error.trace) === null || _error$trace === void 0 ? void 0 : _error$trace.id;
    let transaction;

    if (transactionId && traceId) {
      transaction = await (0, _get_transaction.getTransaction)({
        transactionId,
        traceId,
        setup
      });
    }

    return {
      transaction,
      error,
      occurrencesCount: resp.hits.total.value
    };
  });
}