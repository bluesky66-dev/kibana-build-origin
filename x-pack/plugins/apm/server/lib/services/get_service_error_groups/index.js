"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceErrorGroups = getServiceErrorGroups;

var _lodash = require("lodash");

var _i18n = require("../../../../common/i18n");

var _queries = require("../../../../common/utils/queries");

var _processor_event = require("../../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _get_error_name = require("../../helpers/get_error_name");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceErrorGroups({
  environment,
  serviceName,
  setup,
  size,
  numBuckets,
  pageIndex,
  sortDirection,
  sortField,
  transactionType
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_error_groups', async () => {
    var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4;

    const {
      apmEventClient,
      start,
      end,
      esFilter
    } = setup;
    const {
      intervalString
    } = (0, _get_bucket_size.getBucketSize)({
      start,
      end,
      numBuckets
    });
    const response = await (0, _with_apm_span.withApmSpan)('get_top_service_error_groups', () => apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.error]
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
              term: {
                [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
              }
            }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter]
          }
        },
        aggs: {
          error_groups: {
            terms: {
              field: _elasticsearch_fieldnames.ERROR_GROUP_ID,
              size: 500,
              order: {
                _count: 'desc'
              }
            },
            aggs: {
              sample: {
                top_hits: {
                  size: 1,
                  _source: [_elasticsearch_fieldnames.ERROR_LOG_MESSAGE, _elasticsearch_fieldnames.ERROR_EXC_MESSAGE, '@timestamp'],
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
    const errorGroups = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.error_groups.buckets.map(bucket => {
      var _getErrorName, _bucket$sample$hits$h;

      return {
        group_id: bucket.key,
        name: (_getErrorName = (0, _get_error_name.getErrorName)(bucket.sample.hits.hits[0]._source)) !== null && _getErrorName !== void 0 ? _getErrorName : _i18n.NOT_AVAILABLE_LABEL,
        last_seen: new Date((_bucket$sample$hits$h = bucket.sample.hits.hits[0]) === null || _bucket$sample$hits$h === void 0 ? void 0 : _bucket$sample$hits$h._source['@timestamp']).getTime(),
        occurrences: {
          value: bucket.doc_count
        }
      };
    })) !== null && _response$aggregation !== void 0 ? _response$aggregation : []; // Sort error groups first, and only get timeseries for data in view.
    // This is to limit the possibility of creating too many buckets.

    const sortedAndSlicedErrorGroups = (0, _lodash.orderBy)(errorGroups, group => {
      if (sortField === 'occurrences') {
        return group.occurrences.value;
      }

      return group[sortField];
    }, [sortDirection]).slice(pageIndex * size, pageIndex * size + size);
    const sortedErrorGroupIds = sortedAndSlicedErrorGroups.map(group => group.group_id);
    const timeseriesResponse = await (0, _with_apm_span.withApmSpan)('get_service_error_groups_timeseries', async () => apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.error]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              terms: {
                [_elasticsearch_fieldnames.ERROR_GROUP_ID]: sortedErrorGroupIds
              }
            }, {
              term: {
                [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
              }
            }, {
              term: {
                [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
              }
            }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter]
          }
        },
        aggs: {
          error_groups: {
            terms: {
              field: _elasticsearch_fieldnames.ERROR_GROUP_ID,
              size
            },
            aggs: {
              timeseries: {
                date_histogram: {
                  field: '@timestamp',
                  fixed_interval: intervalString,
                  min_doc_count: 0,
                  extended_bounds: {
                    min: start,
                    max: end
                  }
                }
              }
            }
          }
        }
      }
    }));
    return {
      total_error_groups: errorGroups.length,
      is_aggregation_accurate: ((_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.error_groups.sum_other_doc_count) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : 0) === 0,
      error_groups: sortedAndSlicedErrorGroups.map(errorGroup => {
        var _timeseriesResponse$a, _timeseriesResponse$a2, _timeseriesResponse$a3;

        return { ...errorGroup,
          occurrences: { ...errorGroup.occurrences,
            timeseries: (_timeseriesResponse$a = (_timeseriesResponse$a2 = timeseriesResponse.aggregations) === null || _timeseriesResponse$a2 === void 0 ? void 0 : (_timeseriesResponse$a3 = _timeseriesResponse$a2.error_groups.buckets.find(bucket => bucket.key === errorGroup.group_id)) === null || _timeseriesResponse$a3 === void 0 ? void 0 : _timeseriesResponse$a3.timeseries.buckets.map(dateBucket => ({
              x: dateBucket.key,
              y: dateBucket.doc_count
            }))) !== null && _timeseriesResponse$a !== void 0 ? _timeseriesResponse$a : null
          }
        };
      })
    };
  });
}