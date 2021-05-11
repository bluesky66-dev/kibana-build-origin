"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceMap = getServiceMap;

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _services = require("../../projections/services");

var _merge_projection = require("../../projections/util/merge_projection");

var _queries = require("../../../common/utils/queries");

var _with_apm_span = require("../../utils/with_apm_span");

var _get_service_anomalies = require("./get_service_anomalies");

var _get_service_map_from_trace_ids = require("./get_service_map_from_trace_ids");

var _get_trace_sample_ids = require("./get_trace_sample_ids");

var _transform_service_map_responses = require("./transform_service_map_responses");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getConnectionData({
  setup,
  serviceName,
  environment
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_map_connections', async () => {
    const {
      traceIds
    } = await (0, _get_trace_sample_ids.getTraceSampleIds)({
      setup,
      serviceName,
      environment
    });
    const chunks = (0, _lodash.chunk)(traceIds, setup.config['xpack.apm.serviceMapMaxTracesPerRequest']);
    const init = {
      connections: [],
      discoveredServices: []
    };

    if (!traceIds.length) {
      return init;
    }

    const chunkedResponses = await (0, _with_apm_span.withApmSpan)('get_service_paths_from_all_trace_ids', () => Promise.all(chunks.map(traceIdsChunk => (0, _get_service_map_from_trace_ids.getServiceMapFromTraceIds)({
      setup,
      serviceName,
      environment,
      traceIds: traceIdsChunk
    }))));
    return chunkedResponses.reduce((prev, current) => {
      return {
        connections: prev.connections.concat(current.connections),
        discoveredServices: prev.discoveredServices.concat(current.discoveredServices)
      };
    });
  });
}

async function getServicesData(options) {
  return (0, _with_apm_span.withApmSpan)('get_service_stats_for_service_map', async () => {
    var _response$aggregation;

    const {
      environment,
      setup,
      searchAggregatedTransactions
    } = options;
    const projection = (0, _services.getServicesProjection)({
      setup: { ...setup,
        esFilter: []
      },
      searchAggregatedTransactions
    });
    let filter = [...projection.body.query.bool.filter, ...(0, _queries.environmentQuery)(environment)];

    if (options.serviceName) {
      filter = filter.concat({
        term: {
          [_elasticsearch_fieldnames.SERVICE_NAME]: options.serviceName
        }
      });
    }

    const params = (0, _merge_projection.mergeProjection)(projection, {
      body: {
        size: 0,
        query: {
          bool: { ...projection.body.query.bool,
            filter
          }
        },
        aggs: {
          services: {
            terms: {
              field: projection.body.aggs.services.terms.field,
              size: 500
            },
            aggs: {
              agent_name: {
                terms: {
                  field: _elasticsearch_fieldnames.AGENT_NAME
                }
              }
            }
          }
        }
      }
    });
    const {
      apmEventClient
    } = setup;
    const response = await apmEventClient.search(params);
    return ((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.services.buckets.map(bucket => {
      var _bucket$agent_name$bu;

      return {
        [_elasticsearch_fieldnames.SERVICE_NAME]: bucket.key,
        [_elasticsearch_fieldnames.AGENT_NAME]: ((_bucket$agent_name$bu = bucket.agent_name.buckets[0]) === null || _bucket$agent_name$bu === void 0 ? void 0 : _bucket$agent_name$bu.key) || '',
        [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: options.environment || null
      };
    })) || [];
  });
}

function getServiceMap(options) {
  return (0, _with_apm_span.withApmSpan)('get_service_map', async () => {
    const {
      logger
    } = options;
    const anomaliesPromise = (0, _get_service_anomalies.getServiceAnomalies)(options // always catch error to avoid breaking service maps if there is a problem with ML
    ).catch(error => {
      logger.warn(`Unable to retrieve anomalies for service maps.`);
      logger.error(error);
      return _get_service_anomalies.DEFAULT_ANOMALIES;
    });
    const [connectionData, servicesData, anomalies] = await Promise.all([getConnectionData(options), getServicesData(options), anomaliesPromise]);
    return (0, _transform_service_map_responses.transformServiceMapResponses)({ ...connectionData,
      services: servicesData,
      anomalies
    });
  });
}