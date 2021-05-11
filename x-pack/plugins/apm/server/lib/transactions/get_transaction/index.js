"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransaction = getTransaction;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _queries = require("../../../../common/utils/queries");

var _processor_event = require("../../../../common/processor_event");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getTransaction({
  transactionId,
  traceId,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction', async () => {
    var _resp$hits$hits$;

    const {
      start,
      end,
      apmEventClient
    } = setup;
    const resp = await apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: {
        size: 1,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.TRANSACTION_ID]: transactionId
              }
            }, {
              term: {
                [_elasticsearch_fieldnames.TRACE_ID]: traceId
              }
            }, ...(0, _queries.rangeQuery)(start, end)]
          }
        }
      }
    });
    return (_resp$hits$hits$ = resp.hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : _resp$hits$hits$._source;
  });
}