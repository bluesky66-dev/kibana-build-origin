"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPageViewTrends = getPageViewTrends;

var _rum_page_load_transactions = require("../../projections/rum_page_load_transactions");

var _merge_projection = require("../../projections/util/merge_projection");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getPageViewTrends({
  setup,
  breakdowns,
  urlQuery
}) {
  var _response$aggregation, _topBreakdowns$bucket, _response$aggregation2, _response$aggregation3;

  const projection = (0, _rum_page_load_transactions.getRumPageLoadTransactionsProjection)({
    setup,
    urlQuery,
    checkFetchStartFieldExists: false
  });
  let breakdownItem = null;

  if (breakdowns) {
    breakdownItem = JSON.parse(breakdowns);
  }

  const params = (0, _merge_projection.mergeProjection)(projection, {
    body: {
      size: 0,
      query: {
        bool: projection.body.query.bool
      },
      aggs: {
        pageViews: {
          auto_date_histogram: {
            field: '@timestamp',
            buckets: 50
          },
          aggs: breakdownItem ? {
            breakdown: {
              terms: {
                field: breakdownItem.fieldName,
                size: 9,
                missing: 'Others'
              }
            }
          } : undefined
        },
        ...(breakdownItem ? {
          topBreakdowns: {
            terms: {
              field: breakdownItem.fieldName,
              size: 9
            }
          }
        } : {})
      }
    }
  });
  const {
    apmEventClient
  } = setup;
  const response = await apmEventClient.search(params);
  const {
    topBreakdowns
  } = (_response$aggregation = response.aggregations) !== null && _response$aggregation !== void 0 ? _response$aggregation : {}; // we are only displaying top 9

  const topItems = ((_topBreakdowns$bucket = topBreakdowns === null || topBreakdowns === void 0 ? void 0 : topBreakdowns.buckets) !== null && _topBreakdowns$bucket !== void 0 ? _topBreakdowns$bucket : []).map(({
    key
  }) => key);
  const result = (_response$aggregation2 = (_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.pageViews.buckets) !== null && _response$aggregation2 !== void 0 ? _response$aggregation2 : [];
  return {
    topItems,
    items: result.map(bucket => {
      const {
        key: xVal,
        doc_count: bCount
      } = bucket;
      const res = {
        x: xVal,
        y: bCount
      };

      if ('breakdown' in bucket) {
        let top9Count = 0;
        const categoryBuckets = bucket.breakdown.buckets;
        categoryBuckets.forEach(({
          key,
          doc_count: docCount
        }) => {
          if (topItems.includes(key)) {
            if (res[key]) {
              // if term is already in object, just add it to it
              res[key] += docCount;
            } else {
              res[key] = docCount;
            }

            top9Count += docCount;
          }
        }); // Top 9 plus others, get a diff from parent bucket total

        if (bCount > top9Count) {
          res.Others = bCount - top9Count;
        }
      }

      return res;
    })
  };
}