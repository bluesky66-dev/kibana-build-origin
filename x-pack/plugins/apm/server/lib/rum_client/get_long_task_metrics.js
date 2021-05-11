"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLongTaskMetrics = getLongTaskMetrics;

var _rum_page_load_transactions = require("../../projections/rum_page_load_transactions");

var _merge_projection = require("../../projections/util/merge_projection");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const LONG_TASK_SUM_FIELD = 'transaction.experience.longtask.sum';
const LONG_TASK_COUNT_FIELD = 'transaction.experience.longtask.count';
const LONG_TASK_MAX_FIELD = 'transaction.experience.longtask.max';

async function getLongTaskMetrics({
  setup,
  urlQuery,
  percentile = 50
}) {
  var _response$aggregation, _longTaskCount$values, _longTaskSum$values$p, _longTaskMax$values$p;

  const projection = (0, _rum_page_load_transactions.getRumPageLoadTransactionsProjection)({
    setup,
    urlQuery
  });
  const params = (0, _merge_projection.mergeProjection)(projection, {
    body: {
      size: 0,
      aggs: {
        longTaskSum: {
          percentiles: {
            field: LONG_TASK_SUM_FIELD,
            percents: [percentile],
            hdr: {
              number_of_significant_value_digits: 3
            }
          }
        },
        longTaskCount: {
          percentiles: {
            field: LONG_TASK_COUNT_FIELD,
            percents: [percentile],
            hdr: {
              number_of_significant_value_digits: 3
            }
          }
        },
        longTaskMax: {
          percentiles: {
            field: LONG_TASK_MAX_FIELD,
            percents: [percentile],
            hdr: {
              number_of_significant_value_digits: 3
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
  const pkey = percentile.toFixed(1);
  const {
    longTaskSum,
    longTaskCount,
    longTaskMax
  } = (_response$aggregation = response.aggregations) !== null && _response$aggregation !== void 0 ? _response$aggregation : {};
  return {
    noOfLongTasks: (_longTaskCount$values = longTaskCount === null || longTaskCount === void 0 ? void 0 : longTaskCount.values[pkey]) !== null && _longTaskCount$values !== void 0 ? _longTaskCount$values : 0,
    sumOfLongTasks: (_longTaskSum$values$p = longTaskSum === null || longTaskSum === void 0 ? void 0 : longTaskSum.values[pkey]) !== null && _longTaskSum$values$p !== void 0 ? _longTaskSum$values$p : 0,
    longestLongTask: (_longTaskMax$values$p = longTaskMax === null || longTaskMax === void 0 ? void 0 : longTaskMax.values[pkey]) !== null && _longTaskMax$values$p !== void 0 ? _longTaskMax$values$p : 0
  };
}