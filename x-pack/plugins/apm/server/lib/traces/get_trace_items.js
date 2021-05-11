"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTraceItems = getTraceItems;

var _processor_event = require("../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _queries = require("../../../common/utils/queries");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTraceItems(traceId, setup) {
  return (0, _with_apm_span.withApmSpan)('get_trace_items', async () => {
    var _errorResponse$aggreg, _errorResponse$aggreg2;

    const {
      start,
      end,
      apmEventClient,
      config
    } = setup;
    const maxTraceItems = config['xpack.apm.ui.maxTraceItems'];
    const excludedLogLevels = ['debug', 'info', 'warning'];
    const errorResponsePromise = (0, _with_apm_span.withApmSpan)('get_trace_error_items', () => apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.error]
      },
      body: {
        size: maxTraceItems,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.TRACE_ID]: traceId
              }
            }, ...(0, _queries.rangeQuery)(start, end)],
            must_not: {
              terms: {
                [_elasticsearch_fieldnames.ERROR_LOG_LEVEL]: excludedLogLevels
              }
            }
          }
        },
        aggs: {
          by_transaction_id: {
            terms: {
              field: _elasticsearch_fieldnames.TRANSACTION_ID,
              size: maxTraceItems,
              // high cardinality
              execution_hint: 'map'
            }
          }
        }
      }
    }));
    const traceResponsePromise = (0, _with_apm_span.withApmSpan)('get_trace_span_items', () => apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.span, _processor_event.ProcessorEvent.transaction]
      },
      body: {
        size: maxTraceItems,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.TRACE_ID]: traceId
              }
            }, ...(0, _queries.rangeQuery)(start, end)],
            should: {
              exists: {
                field: _elasticsearch_fieldnames.PARENT_ID
              }
            }
          }
        },
        sort: [{
          _score: {
            order: 'asc'
          }
        }, {
          [_elasticsearch_fieldnames.TRANSACTION_DURATION]: {
            order: 'desc'
          }
        }, {
          [_elasticsearch_fieldnames.SPAN_DURATION]: {
            order: 'desc'
          }
        }],
        track_total_hits: true
      }
    }));
    const [errorResponse, traceResponse] = await Promise.all([errorResponsePromise, traceResponsePromise]);
    const exceedsMax = traceResponse.hits.total.value > maxTraceItems;
    const items = traceResponse.hits.hits.map(hit => hit._source);
    const errorFrequencies = {
      errorDocs: errorResponse.hits.hits.map(({
        _source
      }) => _source),
      errorsPerTransaction: (_errorResponse$aggreg = (_errorResponse$aggreg2 = errorResponse.aggregations) === null || _errorResponse$aggreg2 === void 0 ? void 0 : _errorResponse$aggreg2.by_transaction_id.buckets.reduce((acc, current) => {
        return { ...acc,
          [current.key]: current.doc_count
        };
      }, {})) !== null && _errorResponse$aggreg !== void 0 ? _errorResponse$aggreg : {}
    };
    return {
      items,
      exceedsMax,
      ...errorFrequencies
    };
  });
}