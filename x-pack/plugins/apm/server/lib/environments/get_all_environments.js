"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllEnvironments = getAllEnvironments;

var _processor_event = require("../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _environment_filter_values = require("../../../common/environment_filter_values");

var _aggregated_transactions = require("../helpers/aggregated_transactions");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This is used for getting *all* environments, and does not filter by range.
 * It's used in places where we get the list of all possible environments.
 */


async function getAllEnvironments({
  serviceName,
  setup,
  searchAggregatedTransactions,
  includeMissing = false
}) {
  const spanName = serviceName ? 'get_all_environments_for_service' : 'get_all_environments_for_all_services';
  return (0, _with_apm_span.withApmSpan)(spanName, async () => {
    var _resp$aggregations;

    const {
      apmEventClient,
      config
    } = setup;
    const maxServiceEnvironments = config['xpack.apm.maxServiceEnvironments']; // omit filter for service.name if "All" option is selected

    const serviceNameFilter = serviceName ? [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }] : [];
    const params = {
      apm: {
        events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.error, _processor_event.ProcessorEvent.metric]
      },
      body: { // use timeout + min_doc_count to return as early as possible
        // if filter is not defined to prevent timeouts
        ...(!serviceName ? {
          timeout: '1ms'
        } : {}),
        size: 0,
        query: {
          bool: {
            filter: [...serviceNameFilter]
          }
        },
        aggs: {
          environments: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
              size: maxServiceEnvironments,
              ...(!serviceName ? {
                min_doc_count: 0
              } : {}),
              missing: includeMissing ? _environment_filter_values.ENVIRONMENT_NOT_DEFINED.value : undefined
            }
          }
        }
      }
    };
    const resp = await apmEventClient.search(params);
    const environments = ((_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.environments.buckets.map(bucket => bucket.key)) || [];
    return environments;
  });
}