"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRootTransactionByTraceId = getRootTransactionByTraceId;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getRootTransactionByTraceId(traceId, setup) {
  return (0, _with_apm_span.withApmSpan)('get_root_transaction_by_trace_id', async () => {
    var _resp$hits$hits$;

    const {
      apmEventClient
    } = setup;
    const params = {
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: {
        size: 1,
        query: {
          bool: {
            should: [{
              constant_score: {
                filter: {
                  bool: {
                    must_not: {
                      exists: {
                        field: _elasticsearch_fieldnames.PARENT_ID
                      }
                    }
                  }
                }
              }
            }],
            filter: [{
              term: {
                [_elasticsearch_fieldnames.TRACE_ID]: traceId
              }
            }]
          }
        }
      }
    };
    const resp = await apmEventClient.search(params);
    return {
      transaction: (_resp$hits$hits$ = resp.hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : _resp$hits$hits$._source
    };
  });
}