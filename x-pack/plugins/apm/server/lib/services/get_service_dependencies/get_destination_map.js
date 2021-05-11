"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDestinationMap = void 0;

var _lodash = require("lodash");

var _pick_keys = require("../../../../common/utils/pick_keys");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _queries = require("../../../../common/utils/queries");

var _join_by_key = require("../../../../common/utils/join_by_key");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getDestinationMap = ({
  setup,
  serviceName,
  environment
}) => {
  return (0, _with_apm_span.withApmSpan)('get_service_destination_map', async () => {
    var _response$aggregation, _response$aggregation2;

    const {
      start,
      end,
      apmEventClient
    } = setup;
    const response = await (0, _with_apm_span.withApmSpan)('get_exit_span_samples', async () => apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.span]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
              }
            }, {
              exists: {
                field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE
              }
            }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment)]
          }
        },
        aggs: {
          connections: {
            composite: {
              size: 1000,
              sources: [{
                [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: {
                  terms: {
                    field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE
                  }
                }
              }, // make sure we get samples for both successful
              // and failed calls
              {
                [_elasticsearch_fieldnames.EVENT_OUTCOME]: {
                  terms: {
                    field: _elasticsearch_fieldnames.EVENT_OUTCOME
                  }
                }
              }]
            },
            aggs: {
              sample: {
                top_hits: {
                  size: 1,
                  _source: [_elasticsearch_fieldnames.SPAN_TYPE, _elasticsearch_fieldnames.SPAN_SUBTYPE, _elasticsearch_fieldnames.SPAN_ID],
                  sort: {
                    '@timestamp': 'desc'
                  }
                }
              }
            }
          }
        }
      }
    }));
    const outgoingConnections = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.connections.buckets.map(bucket => {
      const sample = bucket.sample.hits.hits[0]._source;
      return {
        [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: String(bucket.key[_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]),
        [_elasticsearch_fieldnames.SPAN_ID]: sample.span.id,
        [_elasticsearch_fieldnames.SPAN_TYPE]: sample.span.type,
        [_elasticsearch_fieldnames.SPAN_SUBTYPE]: sample.span.subtype
      };
    })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
    const transactionResponse = await (0, _with_apm_span.withApmSpan)('get_transactions_for_exit_spans', () => apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: {
        query: {
          bool: {
            filter: [{
              terms: {
                [_elasticsearch_fieldnames.PARENT_ID]: outgoingConnections.map(connection => connection[_elasticsearch_fieldnames.SPAN_ID])
              }
            }, ...(0, _queries.rangeQuery)(start, end)]
          }
        },
        size: outgoingConnections.length,
        docvalue_fields: [_elasticsearch_fieldnames.SERVICE_NAME, _elasticsearch_fieldnames.SERVICE_ENVIRONMENT, _elasticsearch_fieldnames.AGENT_NAME, _elasticsearch_fieldnames.PARENT_ID],
        _source: false
      }
    }));
    const incomingConnections = transactionResponse.hits.hits.map(hit => {
      var _hit$fields$SERVICE_E, _hit$fields$SERVICE_E2;

      return {
        [_elasticsearch_fieldnames.SPAN_ID]: String(hit.fields[_elasticsearch_fieldnames.PARENT_ID][0]),
        service: {
          name: String(hit.fields[_elasticsearch_fieldnames.SERVICE_NAME][0]),
          environment: String((_hit$fields$SERVICE_E = (_hit$fields$SERVICE_E2 = hit.fields[_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]) === null || _hit$fields$SERVICE_E2 === void 0 ? void 0 : _hit$fields$SERVICE_E2[0]) !== null && _hit$fields$SERVICE_E !== void 0 ? _hit$fields$SERVICE_E : ''),
          agentName: hit.fields[_elasticsearch_fieldnames.AGENT_NAME][0]
        }
      };
    }); // merge outgoing spans with transactions by span.id/parent.id

    const joinedBySpanId = (0, _join_by_key.joinByKey)([...outgoingConnections, ...incomingConnections], _elasticsearch_fieldnames.SPAN_ID); // we could have multiple connections per address because
    // of multiple event outcomes

    const dedupedConnectionsByAddress = (0, _join_by_key.joinByKey)(joinedBySpanId, _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE); // identify a connection by either service.name, service.environment, agent.name
    // OR span.destination.service.resource

    const connectionsWithId = dedupedConnectionsByAddress.map(connection => {
      const id = 'service' in connection ? {
        service: connection.service
      } : (0, _pick_keys.pickKeys)(connection, _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE);
      return { ...connection,
        id
      };
    });
    const dedupedConnectionsById = (0, _join_by_key.joinByKey)(connectionsWithId, 'id');
    const connectionsByAddress = (0, _lodash.keyBy)(connectionsWithId, _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE); // per span.destination.service.resource, return merged/deduped item

    return (0, _lodash.mapValues)(connectionsByAddress, ({
      id
    }) => {
      const connection = dedupedConnectionsById.find(dedupedConnection => (0, _lodash.isEqual)(id, dedupedConnection.id));
      return {
        id,
        span: {
          type: connection[_elasticsearch_fieldnames.SPAN_TYPE],
          subtype: connection[_elasticsearch_fieldnames.SPAN_SUBTYPE],
          destination: {
            service: {
              resource: connection[_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]
            }
          }
        },
        ...('service' in connection && connection.service ? {
          service: {
            name: connection.service.name,
            environment: connection.service.environment
          },
          agent: {
            name: connection.service.agentName
          }
        } : {})
      };
    });
  });
};

exports.getDestinationMap = getDestinationMap;