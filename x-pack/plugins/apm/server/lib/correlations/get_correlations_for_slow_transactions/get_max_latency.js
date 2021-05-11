"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxLatency = getMaxLatency;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getMaxLatency({
  setup,
  backgroundFilters,
  topSigTerms
}) {
  return (0, _with_apm_span.withApmSpan)('get_max_latency', async () => {
    var _response$aggregation, _response$aggregation2;

    const {
      apmEventClient
    } = setup;
    const params = {
      // TODO: add support for metrics
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: backgroundFilters,
            // only include docs containing the significant terms
            should: topSigTerms.map(term => ({
              term: {
                [term.fieldName]: term.fieldValue
              }
            })),
            minimum_should_match: 1
          }
        },
        aggs: {
          // TODO: add support for metrics
          // max_latency: { max: { field: TRANSACTION_DURATION } },
          max_latency: {
            percentiles: {
              field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
              percents: [99]
            }
          }
        }
      }
    };
    const response = await apmEventClient.search(params); // return response.aggregations?.max_latency.value;

    return Object.values((_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.max_latency.values) !== null && _response$aggregation !== void 0 ? _response$aggregation : {})[0];
  });
}