"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorGroups = getErrorGroups;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _errors = require("../../projections/errors");

var _merge_projection = require("../../projections/util/merge_projection");

var _with_apm_span = require("../../utils/with_apm_span");

var _get_error_name = require("../helpers/get_error_name");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getErrorGroups({
  environment,
  serviceName,
  sortField,
  sortDirection = 'desc',
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_error_groups', async () => {
    var _resp$aggregations;

    const {
      apmEventClient
    } = setup; // sort buckets by last occurrence of error

    const sortByLatestOccurrence = sortField === 'latestOccurrenceAt';
    const projection = (0, _errors.getErrorGroupsProjection)({
      environment,
      setup,
      serviceName
    });
    const order = sortByLatestOccurrence ? {
      max_timestamp: sortDirection
    } : {
      _count: sortDirection
    };
    const params = (0, _merge_projection.mergeProjection)(projection, {
      body: {
        size: 0,
        aggs: {
          error_groups: {
            terms: { ...projection.body.aggs.error_groups.terms,
              size: 500,
              order
            },
            aggs: {
              sample: {
                top_hits: {
                  _source: [_elasticsearch_fieldnames.ERROR_LOG_MESSAGE, _elasticsearch_fieldnames.ERROR_EXC_MESSAGE, _elasticsearch_fieldnames.ERROR_EXC_HANDLED, _elasticsearch_fieldnames.ERROR_EXC_TYPE, _elasticsearch_fieldnames.ERROR_CULPRIT, _elasticsearch_fieldnames.ERROR_GROUP_ID, '@timestamp'],
                  sort: [{
                    '@timestamp': 'desc'
                  }],
                  size: 1
                }
              },
              ...(sortByLatestOccurrence ? {
                max_timestamp: {
                  max: {
                    field: '@timestamp'
                  }
                }
              } : {})
            }
          }
        }
      }
    });
    const resp = await apmEventClient.search(params); // aggregations can be undefined when no matching indices are found.
    // this is an exception rather than the rule so the ES type does not account for this.

    const hits = (((_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.error_groups.buckets) || []).map(bucket => {
      var _source$error$excepti, _source$error$excepti2;

      const source = bucket.sample.hits.hits[0]._source;
      const message = (0, _get_error_name.getErrorName)(source);
      return {
        message,
        occurrenceCount: bucket.doc_count,
        culprit: source.error.culprit,
        groupId: source.error.grouping_key,
        latestOccurrenceAt: source['@timestamp'],
        handled: (_source$error$excepti = source.error.exception) === null || _source$error$excepti === void 0 ? void 0 : _source$error$excepti[0].handled,
        type: (_source$error$excepti2 = source.error.exception) === null || _source$error$excepti2 === void 0 ? void 0 : _source$error$excepti2[0].type
      };
    });
    return hits;
  });
}