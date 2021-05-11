"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTraceSampleIds = getTraceSampleIds;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../common/processor_event");

var _service_map = require("../../../common/service_map");

var _queries = require("../../../common/utils/queries");

var _with_apm_span = require("../../utils/with_apm_span");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAX_TRACES_TO_INSPECT = 1000;

function getTraceSampleIds({
  serviceName,
  environment,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_trace_sample_ids', async () => {
    const {
      start,
      end,
      apmEventClient,
      config
    } = setup;
    const query = {
      bool: {
        filter: [{
          exists: {
            field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE
          }
        }, ...(0, _queries.rangeQuery)(start, end)]
      }
    };

    if (serviceName) {
      query.bool.filter.push({
        term: {
          [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
        }
      });
    }

    query.bool.filter.push(...(0, _queries.environmentQuery)(environment));
    const fingerprintBucketSize = serviceName ? config['xpack.apm.serviceMapFingerprintBucketSize'] : config['xpack.apm.serviceMapFingerprintGlobalBucketSize'];
    const traceIdBucketSize = serviceName ? config['xpack.apm.serviceMapTraceIdBucketSize'] : config['xpack.apm.serviceMapTraceIdGlobalBucketSize'];
    const samplerShardSize = traceIdBucketSize * 10;
    const params = {
      apm: {
        events: [_processor_event.ProcessorEvent.span]
      },
      body: {
        size: 0,
        query,
        aggs: {
          connections: {
            composite: {
              sources: [{
                [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: {
                  terms: {
                    field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE
                  }
                }
              }, {
                [_elasticsearch_fieldnames.SERVICE_NAME]: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_NAME
                  }
                }
              }, {
                [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
                    missing_bucket: true
                  }
                }
              }],
              size: fingerprintBucketSize
            },
            aggs: {
              sample: {
                sampler: {
                  shard_size: samplerShardSize
                },
                aggs: {
                  trace_ids: {
                    terms: {
                      field: _elasticsearch_fieldnames.TRACE_ID,
                      size: traceIdBucketSize,
                      execution_hint: 'map',
                      // remove bias towards large traces by sorting on trace.id
                      // which will be random-esque
                      order: {
                        _key: 'desc'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    try {
      var _tracesSampleResponse;

      const tracesSampleResponse = await apmEventClient.search(params); // make sure at least one trace per composite/connection bucket
      // is queried

      const traceIdsWithPriority = ((_tracesSampleResponse = tracesSampleResponse.aggregations) === null || _tracesSampleResponse === void 0 ? void 0 : _tracesSampleResponse.connections.buckets.flatMap(bucket => bucket.sample.trace_ids.buckets.map((sampleDocBucket, index) => ({
        traceId: sampleDocBucket.key,
        priority: index
      })))) || [];
      const traceIds = (0, _lodash.take)((0, _lodash.uniq)((0, _lodash.sortBy)(traceIdsWithPriority, 'priority').map(({
        traceId
      }) => traceId)), MAX_TRACES_TO_INSPECT);
      return {
        traceIds
      };
    } catch (error) {
      if ('displayName' in error && error.displayName === 'RequestTimeout') {
        throw _boom.default.internal(_service_map.SERVICE_MAP_TIMEOUT_ERROR);
      }

      throw error;
    }
  });
}