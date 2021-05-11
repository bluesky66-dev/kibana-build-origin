"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilterBucketAgg = void 0;

var _i18n = require("@kbn/i18n");

var _bucket_agg_type = require("./bucket_agg_type");

var _bucket_agg_types = require("./bucket_agg_types");

var _filter_fn = require("./filter_fn");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const filterTitle = _i18n.i18n.translate('data.search.aggs.buckets.filterTitle', {
  defaultMessage: 'Filter'
});

const getFilterBucketAgg = () => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.FILTER,
  expressionName: _filter_fn.aggFilterFnName,
  title: filterTitle,
  makeLabel: () => filterTitle,
  params: [{
    name: 'geo_bounding_box'
  }]
});

exports.getFilterBucketAgg = getFilterBucketAgg;