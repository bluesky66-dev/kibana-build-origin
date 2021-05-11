"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUrlSearch = getUrlSearch;

var _merge_projection = require("../../projections/util/merge_projection");

var _rum_page_load_transactions = require("../../projections/rum_page_load_transactions");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getUrlSearch({
  setup,
  urlQuery,
  percentile
}) {
  var _response$aggregation, _urls$buckets;

  const projection = (0, _rum_page_load_transactions.getRumPageLoadTransactionsProjection)({
    setup,
    urlQuery
  });
  const params = (0, _merge_projection.mergeProjection)(projection, {
    body: {
      size: 0,
      aggs: {
        totalUrls: {
          cardinality: {
            field: _elasticsearch_fieldnames.TRANSACTION_URL
          }
        },
        urls: {
          terms: {
            field: _elasticsearch_fieldnames.TRANSACTION_URL,
            size: 10
          },
          aggs: {
            medianPLD: {
              percentiles: {
                field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
                percents: [percentile]
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
    urls,
    totalUrls
  } = (_response$aggregation = response.aggregations) !== null && _response$aggregation !== void 0 ? _response$aggregation : {};
  const pkey = percentile.toFixed(1);
  return {
    total: (totalUrls === null || totalUrls === void 0 ? void 0 : totalUrls.value) || 0,
    items: ((_urls$buckets = urls === null || urls === void 0 ? void 0 : urls.buckets) !== null && _urls$buckets !== void 0 ? _urls$buckets : []).map(bucket => {
      var _bucket$medianPLD$val;

      return {
        url: bucket.key,
        count: bucket.doc_count,
        pld: (_bucket$medianPLD$val = bucket.medianPLD.values[pkey]) !== null && _bucket$medianPLD$val !== void 0 ? _bucket$medianPLD$val : 0
      };
    })
  };
}