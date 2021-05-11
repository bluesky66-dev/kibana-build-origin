"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBuckets = getBuckets;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _queries = require("../../../../common/utils/queries");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getBuckets({
  environment,
  serviceName,
  groupId,
  bucketSize,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_error_distribution_buckets', async () => {
    var _resp$aggregations;

    const {
      start,
      end,
      esFilter,
      apmEventClient
    } = setup;
    const filter = [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }, ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter];

    if (groupId) {
      filter.push({
        term: {
          [_elasticsearch_fieldnames.ERROR_GROUP_ID]: groupId
        }
      });
    }

    const params = {
      apm: {
        events: [_processor_event.ProcessorEvent.error]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter
          }
        },
        aggs: {
          distribution: {
            histogram: {
              field: '@timestamp',
              min_doc_count: 0,
              interval: bucketSize,
              extended_bounds: {
                min: start,
                max: end
              }
            }
          }
        }
      }
    };
    const resp = await apmEventClient.search(params);
    const buckets = (((_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.distribution.buckets) || []).map(bucket => ({
      key: bucket.key,
      count: bucket.doc_count
    }));
    return {
      noHits: resp.hits.total.value === 0,
      buckets: resp.hits.total.value > 0 ? buckets : []
    };
  });
}