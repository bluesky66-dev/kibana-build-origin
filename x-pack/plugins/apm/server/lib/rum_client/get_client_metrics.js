"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClientMetrics = getClientMetrics;

var _rum_page_load_transactions = require("../../projections/rum_page_load_transactions");

var _merge_projection = require("../../projections/util/merge_projection");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getClientMetrics({
  setup,
  urlQuery,
  percentile = 50
}) {
  var _totalPageLoadDuratio, _backEnd$values$pkey, _response$hits$total$;

  const projection = (0, _rum_page_load_transactions.getRumPageLoadTransactionsProjection)({
    setup,
    urlQuery,
    checkFetchStartFieldExists: false
  });
  const params = (0, _merge_projection.mergeProjection)(projection, {
    body: {
      size: 0,
      track_total_hits: true,
      aggs: {
        hasFetchStartField: {
          filter: {
            exists: {
              field: 'transaction.marks.navigationTiming.fetchStart'
            }
          },
          aggs: {
            totalPageLoadDuration: {
              percentiles: {
                field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
                percents: [percentile],
                hdr: {
                  number_of_significant_value_digits: 3
                }
              }
            },
            backEnd: {
              percentiles: {
                field: _elasticsearch_fieldnames.TRANSACTION_TIME_TO_FIRST_BYTE,
                percents: [percentile],
                hdr: {
                  number_of_significant_value_digits: 3
                }
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
    hasFetchStartField: {
      backEnd,
      totalPageLoadDuration
    }
  } = response.aggregations;
  const pkey = percentile.toFixed(1);
  const totalPageLoadDurationValue = (_totalPageLoadDuratio = totalPageLoadDuration.values[pkey]) !== null && _totalPageLoadDuratio !== void 0 ? _totalPageLoadDuratio : 0;
  const totalPageLoadDurationValueMs = totalPageLoadDurationValue / 1000; // Microseconds to milliseconds

  const backendValue = (_backEnd$values$pkey = backEnd.values[pkey]) !== null && _backEnd$values$pkey !== void 0 ? _backEnd$values$pkey : 0;
  return {
    pageViews: {
      value: (_response$hits$total$ = response.hits.total.value) !== null && _response$hits$total$ !== void 0 ? _response$hits$total$ : 0
    },
    totalPageLoadDuration: {
      value: totalPageLoadDurationValueMs
    },
    backEnd: {
      value: backendValue
    },
    frontEnd: {
      value: totalPageLoadDurationValueMs - backendValue
    }
  };
}