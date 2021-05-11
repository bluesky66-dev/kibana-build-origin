"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVisitorBreakdown = getVisitorBreakdown;

var _rum_page_load_transactions = require("../../projections/rum_page_load_transactions");

var _merge_projection = require("../../projections/util/merge_projection");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getVisitorBreakdown({
  setup,
  urlQuery
}) {
  const projection = (0, _rum_page_load_transactions.getRumPageLoadTransactionsProjection)({
    setup,
    urlQuery
  });
  const params = (0, _merge_projection.mergeProjection)(projection, {
    body: {
      size: 0,
      track_total_hits: true,
      query: {
        bool: projection.body.query.bool
      },
      aggs: {
        browsers: {
          terms: {
            field: _elasticsearch_fieldnames.USER_AGENT_NAME,
            size: 9
          }
        },
        os: {
          terms: {
            field: _elasticsearch_fieldnames.USER_AGENT_OS,
            size: 9
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
    browsers,
    os
  } = response.aggregations;
  const totalItems = response.hits.total.value;
  const browserTotal = browsers.buckets.reduce((prevVal, item) => prevVal + item.doc_count, 0);
  const osTotal = os.buckets.reduce((prevVal, item) => prevVal + item.doc_count, 0);
  const browserItems = browsers.buckets.map(bucket => ({
    count: bucket.doc_count,
    name: bucket.key
  }));

  if (totalItems > 0) {
    browserItems.push({
      count: totalItems - browserTotal,
      name: 'Others'
    });
  }

  const osItems = os.buckets.map(bucket => ({
    count: bucket.doc_count,
    name: bucket.key
  }));

  if (totalItems > 0) {
    osItems.push({
      count: totalItems - osTotal,
      name: 'Others'
    });
  }

  return {
    os: osItems,
    browsers: browserItems
  };
}