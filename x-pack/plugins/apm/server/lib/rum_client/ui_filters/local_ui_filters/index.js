"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalUIFilters = getLocalUIFilters;

var _lodash = require("lodash");

var _get_local_filter_query = require("./get_local_filter_query");

var _config = require("./config");

var _with_apm_span = require("../../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getLocalUIFilters({
  setup,
  projection,
  uiFilters,
  localFilterNames
}) {
  return (0, _with_apm_span.withApmSpan)('get_ui_filter_options', () => {
    const {
      apmEventClient
    } = setup;
    const projectionWithoutAggs = (0, _lodash.cloneDeep)(projection);
    delete projectionWithoutAggs.body.aggs;
    return Promise.all(localFilterNames.map(async name => (0, _with_apm_span.withApmSpan)('get_ui_filter_options_for_field', async () => {
      var _response$aggregation, _response$aggregation2, _response$aggregation3;

      const query = (0, _get_local_filter_query.getLocalFilterQuery)({
        uiFilters,
        projection,
        localUIFilterName: name
      });
      const response = await apmEventClient.search(query);
      const filter = _config.localUIFilters[name];
      const buckets = (_response$aggregation = response === null || response === void 0 ? void 0 : (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.by_terms) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.buckets) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
      return { ...filter,
        options: (0, _lodash.orderBy)(buckets.map(bucket => {
          return {
            name: bucket.key,
            count: bucket.bucket_count ? bucket.bucket_count.value : bucket.doc_count
          };
        }), 'count', 'desc')
      };
    })));
  });
}