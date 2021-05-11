"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransaction = getTransaction;

var _processor_event = require("../../../../common/processor_event");

var _helper = require("./helper");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getTransaction({
  setup,
  filters = {}
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction_for_custom_link', async () => {
    var _resp$hits$hits$;

    const {
      apmEventClient
    } = setup;
    const esFilters = Object.entries(filters) // loops through the filters splitting the value by comma and removing white spaces
    .map(([key, value]) => {
      if (value) {
        return {
          terms: {
            [key]: (0, _helper.splitFilterValueByComma)(value)
          }
        };
      }
    }) // removes filters without value
    .filter(value => value);
    const params = {
      terminateAfter: 1,
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      size: 1,
      body: {
        query: {
          bool: {
            filter: esFilters
          }
        }
      }
    };
    const resp = await apmEventClient.search(params);
    return (_resp$hits$hits$ = resp.hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : _resp$hits$hits$._source;
  });
}