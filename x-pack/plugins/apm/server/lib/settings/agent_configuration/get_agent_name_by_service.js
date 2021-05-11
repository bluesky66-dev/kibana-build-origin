"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentNameByService = getAgentNameByService;

var _processor_event = require("../../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getAgentNameByService({
  serviceName,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_agent_name_by_service', async () => {
    var _aggregations$agent_n;

    const {
      apmEventClient
    } = setup;
    const params = {
      terminateAfter: 1,
      apm: {
        events: [_processor_event.ProcessorEvent.transaction, _processor_event.ProcessorEvent.error, _processor_event.ProcessorEvent.metric]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
              }
            }]
          }
        },
        aggs: {
          agent_names: {
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
    const agentName = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$agent_n = aggregations.agent_names.buckets[0]) === null || _aggregations$agent_n === void 0 ? void 0 : _aggregations$agent_n.key;
    return agentName;
  });
}