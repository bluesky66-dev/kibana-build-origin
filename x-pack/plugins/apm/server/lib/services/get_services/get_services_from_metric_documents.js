"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServicesFromMetricDocuments = getServicesFromMetricDocuments;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _queries = require("../../../../common/utils/queries");

var _processor_event = require("../../../../common/processor_event");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServicesFromMetricDocuments({
  environment,
  setup,
  maxNumServices,
  kuery
}) {
  return (0, _with_apm_span.withApmSpan)('get_services_from_metric_documents', async () => {
    var _response$aggregation, _response$aggregation2;

    const {
      apmEventClient,
      start,
      end,
      esFilter
    } = setup;
    const response = await apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.metric]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter]
          }
        },
        aggs: {
          services: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_NAME,
              size: maxNumServices
            },
            aggs: {
              environments: {
                terms: {
                  field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
                }
              },
              latest: {
                top_metrics: {
                  metrics: {
                    field: _elasticsearch_fieldnames.AGENT_NAME
                  },
                  sort: {
                    '@timestamp': 'desc'
                  }
                }
              }
            }
          }
        }
      }
    });
    return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.services.buckets.map(bucket => {
      return {
        serviceName: bucket.key,
        environments: bucket.environments.buckets.map(envBucket => envBucket.key),
        agentName: bucket.latest.top[0].metrics[_elasticsearch_fieldnames.AGENT_NAME]
      };
    })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  });
}