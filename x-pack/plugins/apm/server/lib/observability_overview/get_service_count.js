"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceCount = getServiceCount;

var _processor_event = require("../../../common/processor_event");

var _queries = require("../../../common/utils/queries");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceCount({
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('observability_overview_get_service_count', async () => {
    const {
      apmEventClient,
      start,
      end
    } = setup;
    const params = {
      apm: {
        events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.error, _processor_event.ProcessorEvent.metric]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: (0, _queries.rangeQuery)(start, end)
          }
        },
        aggs: {
          serviceCount: {
            cardinality: {
              field: _elasticsearch_fieldnames.SERVICE_NAME
            }
          }
        }
      }
    };
    const {
      aggregations
    } = await apmEventClient.search(params);
    return (aggregations === null || aggregations === void 0 ? void 0 : aggregations.serviceCount.value) || 0;
  });
}