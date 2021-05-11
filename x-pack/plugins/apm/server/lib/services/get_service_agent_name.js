"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceAgentName = getServiceAgentName;

var _processor_event = require("../../../common/processor_event");

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


function getServiceAgentName({
  serviceName,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_agent_name', async () => {
    var _aggregations$agents$;

    const {
      start,
      end,
      apmEventClient
    } = setup;
    const params = {
      terminateAfter: 1,
      apm: {
        events: [_processor_event.ProcessorEvent.error, (0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.metric]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
              }
            }, ...(0, _queries.rangeQuery)(start, end)]
          }
        },
        aggs: {
          agents: {
            terms: {
              field: _elasticsearch_fieldnames.AGENT_NAME,
              size: 1
            }
          }
        }
      }
    };
    const {
      aggregations
    } = await apmEventClient.search(params);
    const agentName = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$agents$ = aggregations.agents.buckets[0]) === null || _aggregations$agents$ === void 0 ? void 0 : _aggregations$agents$.key;
    return {
      agentName
    };
  });
}