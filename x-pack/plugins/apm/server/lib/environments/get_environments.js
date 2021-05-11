"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnvironments = getEnvironments;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _environment_filter_values = require("../../../common/environment_filter_values");

var _processor_event = require("../../../common/processor_event");

var _queries = require("../../../common/utils/queries");

var _with_apm_span = require("../../utils/with_apm_span");

var _aggregated_transactions = require("../helpers/aggregated_transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This is used for getting the list of environments for the environments selector,
 * filtered by range.
 */


async function getEnvironments({
  setup,
  serviceName,
  searchAggregatedTransactions
}) {
  const spanName = serviceName ? 'get_environments_for_service' : 'get_environments';
  return (0, _with_apm_span.withApmSpan)(spanName, async () => {
    const {
      start,
      end,
      apmEventClient,
      config
    } = setup;
    const filter = (0, _queries.rangeQuery)(start, end);

    if (serviceName) {
      filter.push({
        term: {
          [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
        }
      });
    }

    const maxServiceEnvironments = config['xpack.apm.maxServiceEnvironments'];
    const params = {
      apm: {
        events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.metric, _processor_event.ProcessorEvent.error]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter
          }
        },
        aggs: {
          environments: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
              missing: _environment_filter_values.ENVIRONMENT_NOT_DEFINED.value,
              size: maxServiceEnvironments
            }
          }
        }
      }
    };
    const resp = await apmEventClient.search(params);
    const aggs = resp.aggregations;
    const environmentsBuckets = (aggs === null || aggs === void 0 ? void 0 : aggs.environments.buckets) || [];
    const environments = environmentsBuckets.map(environmentBucket => environmentBucket.key);
    return environments;
  });
}