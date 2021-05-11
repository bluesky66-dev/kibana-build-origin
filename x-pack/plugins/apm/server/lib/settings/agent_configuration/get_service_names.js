"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceNames = getServiceNames;

var _processor_event = require("../../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _all_option = require("../../../../common/agent_configuration/all_option");

var _aggregated_transactions = require("../../helpers/aggregated_transactions");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceNames({
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_names_for_agent_config', async () => {
    var _resp$aggregations;

    const {
      apmEventClient,
      config
    } = setup;
    const maxServiceSelection = config['xpack.apm.maxServiceSelection'];
    const params = {
      apm: {
        events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.error, _processor_event.ProcessorEvent.metric]
      },
      body: {
        timeout: '1ms',
        size: 0,
        aggs: {
          services: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_NAME,
              size: maxServiceSelection,
              min_doc_count: 0
            }
          }
        }
      }
    };
    const resp = await apmEventClient.search(params);
    const serviceNames = ((_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.services.buckets.map(bucket => bucket.key).sort()) || [];
    return [_all_option.ALL_OPTION_VALUE, ...serviceNames];
  });
}