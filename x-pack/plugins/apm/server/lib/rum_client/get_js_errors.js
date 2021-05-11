"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJSErrors = getJSErrors;

var _merge_projection = require("../../projections/util/merge_projection");

var _rum_page_load_transactions = require("../../projections/rum_page_load_transactions");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _transaction_types = require("../../../common/transaction_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getJSErrors({
  setup,
  pageSize,
  pageIndex,
  urlQuery
}) {
  var _response$aggregation, _totalErrorPages$valu, _response$hits$total$, _totalErrorGroups$val;

  const projection = (0, _rum_page_load_transactions.getRumErrorsProjection)({
    setup,
    urlQuery
  });
  const params = (0, _merge_projection.mergeProjection)(projection, {
    body: {
      size: 0,
      track_total_hits: true,
      aggs: {
        totalErrorGroups: {
          cardinality: {
            field: _elasticsearch_fieldnames.ERROR_GROUP_ID
          }
        },
        totalErrorPages: {
          cardinality: {
            field: _elasticsearch_fieldnames.TRANSACTION_ID
          }
        },
        errors: {
          terms: {
            field: _elasticsearch_fieldnames.ERROR_GROUP_ID,
            size: 500
          },
          aggs: {
            bucket_truncate: {
              bucket_sort: {
                size: pageSize,
                from: pageIndex * pageSize
              }
            },
            impactedPages: {
              filter: {
                term: {
                  [_elasticsearch_fieldnames.TRANSACTION_TYPE]: _transaction_types.TRANSACTION_PAGE_LOAD
                }
              },
              aggs: {
                pageCount: {
                  cardinality: {
                    field: _elasticsearch_fieldnames.TRANSACTION_ID
                  }
                }
              }
            },
            sample: {
              top_hits: {
                _source: [_elasticsearch_fieldnames.ERROR_EXC_MESSAGE, _elasticsearch_fieldnames.ERROR_EXC_TYPE, _elasticsearch_fieldnames.ERROR_GROUP_ID, '@timestamp'],
                sort: [{
                  '@timestamp': 'desc'
                }],
                size: 1
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
  const {
    totalErrorGroups,
    totalErrorPages,
    errors
  } = (_response$aggregation = response.aggregations) !== null && _response$aggregation !== void 0 ? _response$aggregation : {};
  return {
    totalErrorPages: (_totalErrorPages$valu = totalErrorPages === null || totalErrorPages === void 0 ? void 0 : totalErrorPages.value) !== null && _totalErrorPages$valu !== void 0 ? _totalErrorPages$valu : 0,
    totalErrors: (_response$hits$total$ = response.hits.total.value) !== null && _response$hits$total$ !== void 0 ? _response$hits$total$ : 0,
    totalErrorGroups: (_totalErrorGroups$val = totalErrorGroups === null || totalErrorGroups === void 0 ? void 0 : totalErrorGroups.value) !== null && _totalErrorGroups$val !== void 0 ? _totalErrorGroups$val : 0,
    items: errors === null || errors === void 0 ? void 0 : errors.buckets.map(({
      sample,
      key,
      impactedPages
    }) => {
      var _error$exception;

      return {
        count: impactedPages.pageCount.value,
        errorGroupId: key,
        errorMessage: (_error$exception = sample.hits.hits[0]._source.error.exception) === null || _error$exception === void 0 ? void 0 : _error$exception[0].message
      };
    })
  };
}