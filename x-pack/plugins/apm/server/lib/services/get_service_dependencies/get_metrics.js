"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetrics = void 0;

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _queries = require("../../../../common/utils/queries");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _event_outcome = require("../../../../common/event_outcome");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getMetrics = ({
  setup,
  serviceName,
  environment,
  numBuckets
}) => {
  return (0, _with_apm_span.withApmSpan)('get_service_destination_metrics', async () => {
    var _response$aggregation, _response$aggregation2;

    const {
      start,
      end,
      apmEventClient
    } = setup;
    const response = await apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.metric]
      },
      body: {
        track_total_hits: true,
        size: 0,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
              }
            }, {
              exists: {
                field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT
              }
            }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment)]
          }
        },
        aggs: {
          connections: {
            terms: {
              field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE,
              size: 100
            },
            aggs: {
              timeseries: {
                date_histogram: {
                  field: '@timestamp',
                  fixed_interval: (0, _get_bucket_size.getBucketSize)({
                    start,
                    end,
                    numBuckets
                  }).intervalString,
                  extended_bounds: {
                    min: start,
                    max: end
                  }
                },
                aggs: {
                  latency_sum: {
                    sum: {
                      field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_SUM
                    }
                  },
                  count: {
                    sum: {
                      field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT
                    }
                  },
                  [_elasticsearch_fieldnames.EVENT_OUTCOME]: {
                    terms: {
                      field: _elasticsearch_fieldnames.EVENT_OUTCOME
                    },
                    aggs: {
                      count: {
                        sum: {
                          field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.connections.buckets.map(bucket => ({
      span: {
        destination: {
          service: {
            resource: String(bucket.key)
          }
        }
      },
      value: {
        count: (0, _lodash.sum)(bucket.timeseries.buckets.map(dateBucket => {
          var _dateBucket$count$val;

          return (_dateBucket$count$val = dateBucket.count.value) !== null && _dateBucket$count$val !== void 0 ? _dateBucket$count$val : 0;
        })),
        latency_sum: (0, _lodash.sum)(bucket.timeseries.buckets.map(dateBucket => {
          var _dateBucket$latency_s;

          return (_dateBucket$latency_s = dateBucket.latency_sum.value) !== null && _dateBucket$latency_s !== void 0 ? _dateBucket$latency_s : 0;
        })),
        error_count: (0, _lodash.sum)(bucket.timeseries.buckets.flatMap(dateBucket => {
          var _dateBucket$EVENT_OUT, _dateBucket$EVENT_OUT2;

          return (_dateBucket$EVENT_OUT = (_dateBucket$EVENT_OUT2 = dateBucket[_elasticsearch_fieldnames.EVENT_OUTCOME].buckets.find(outcomeBucket => outcomeBucket.key === _event_outcome.EventOutcome.failure)) === null || _dateBucket$EVENT_OUT2 === void 0 ? void 0 : _dateBucket$EVENT_OUT2.count.value) !== null && _dateBucket$EVENT_OUT !== void 0 ? _dateBucket$EVENT_OUT : 0;
        }))
      },
      timeseries: bucket.timeseries.buckets.map(dateBucket => {
        var _dateBucket$count$val2, _dateBucket$latency_s2, _dateBucket$EVENT_OUT3, _dateBucket$EVENT_OUT4;

        return {
          x: dateBucket.key,
          count: (_dateBucket$count$val2 = dateBucket.count.value) !== null && _dateBucket$count$val2 !== void 0 ? _dateBucket$count$val2 : 0,
          latency_sum: (_dateBucket$latency_s2 = dateBucket.latency_sum.value) !== null && _dateBucket$latency_s2 !== void 0 ? _dateBucket$latency_s2 : 0,
          error_count: (_dateBucket$EVENT_OUT3 = (_dateBucket$EVENT_OUT4 = dateBucket[_elasticsearch_fieldnames.EVENT_OUTCOME].buckets.find(outcomeBucket => outcomeBucket.key === _event_outcome.EventOutcome.failure)) === null || _dateBucket$EVENT_OUT4 === void 0 ? void 0 : _dateBucket$EVENT_OUT4.count.value) !== null && _dateBucket$EVENT_OUT3 !== void 0 ? _dateBucket$EVENT_OUT3 : 0
        };
      })
    }))) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  });
};

exports.getMetrics = getMetrics;