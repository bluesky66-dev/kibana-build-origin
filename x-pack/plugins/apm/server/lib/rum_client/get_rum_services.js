"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRumServices = getRumServices;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _rum_page_load_transactions = require("../../projections/rum_page_load_transactions");

var _merge_projection = require("../../projections/util/merge_projection");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getRumServices({
  setup
}) {
  var _response$aggregation, _response$aggregation2;

  const projection = (0, _rum_page_load_transactions.getRumPageLoadTransactionsProjection)({
    setup
  });
  const params = (0, _merge_projection.mergeProjection)(projection, {
    body: {
      size: 0,
      query: {
        bool: projection.body.query.bool
      },
      aggs: {
        services: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NAME,
            size: 1000
          }
        }
      }
    }
  });
  const {
    apmEventClient
  } = setup;
  const response = await apmEventClient.search(params);
  const result = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.services.buckets) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  return result.map(({
    key
  }) => key);
}