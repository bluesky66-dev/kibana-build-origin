"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDerivedServiceAnnotations = getDerivedServiceAnnotations;

var _lodash = require("lodash");

var _annotations = require("../../../../common/annotations");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _queries = require("../../../../common/utils/queries");

var _with_apm_span = require("../../../utils/with_apm_span");

var _aggregated_transactions = require("../../helpers/aggregated_transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getDerivedServiceAnnotations({
  setup,
  serviceName,
  environment,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_derived_service_annotations', async () => {
    var _await$apmEventClient, _await$apmEventClient2;

    const {
      start,
      end,
      apmEventClient
    } = setup;
    const filter = [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }, ...(0, _aggregated_transactions.getDocumentTypeFilterForAggregatedTransactions)(searchAggregatedTransactions), ...(0, _queries.environmentQuery)(environment)];
    const versions = (_await$apmEventClient = (_await$apmEventClient2 = (await apmEventClient.search({
      apm: {
        events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions)]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [...filter, ...(0, _queries.rangeQuery)(start, end)]
          }
        },
        aggs: {
          versions: {
            terms: {
              field: _elasticsearch_fieldnames.SERVICE_VERSION
            }
          }
        }
      }
    })).aggregations) === null || _await$apmEventClient2 === void 0 ? void 0 : _await$apmEventClient2.versions.buckets.map(bucket => bucket.key)) !== null && _await$apmEventClient !== void 0 ? _await$apmEventClient : [];

    if (versions.length <= 1) {
      return [];
    }

    const annotations = await Promise.all(versions.map(async version => {
      return (0, _with_apm_span.withApmSpan)('get_first_seen_of_version', async () => {
        var _response$aggregation;

        const response = await apmEventClient.search({
          apm: {
            events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions)]
          },
          body: {
            size: 0,
            query: {
              bool: {
                filter: [...filter, {
                  term: {
                    [_elasticsearch_fieldnames.SERVICE_VERSION]: version
                  }
                }]
              }
            },
            aggs: {
              first_seen: {
                min: {
                  field: '@timestamp'
                }
              }
            }
          }
        });
        const firstSeen = (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.first_seen.value;

        if (!(0, _lodash.isNumber)(firstSeen)) {
          throw new Error('First seen for version was unexpectedly undefined or null.');
        }

        if (firstSeen < start || firstSeen > end) {
          return null;
        }

        return {
          type: _annotations.AnnotationType.VERSION,
          id: version,
          '@timestamp': firstSeen,
          text: version
        };
      });
    }));
    return annotations.filter(Boolean);
  });
}