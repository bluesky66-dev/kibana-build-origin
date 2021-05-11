"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignificantTermsBucketAgg = void 0;

var _i18n = require("@kbn/i18n");

var _bucket_agg_type = require("./bucket_agg_type");

var _terms = require("./create_filter/terms");

var _migrate_include_exclude_format = require("./migrate_include_exclude_format");

var _bucket_agg_types = require("./bucket_agg_types");

var _significant_terms_fn = require("./significant_terms_fn");

var _common = require("../../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const significantTermsTitle = _i18n.i18n.translate('data.search.aggs.buckets.significantTermsTitle', {
  defaultMessage: 'Significant Terms'
});

const getSignificantTermsBucketAgg = () => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.SIGNIFICANT_TERMS,
  expressionName: _significant_terms_fn.aggSignificantTermsFnName,
  title: significantTermsTitle,

  makeLabel(aggConfig) {
    return _i18n.i18n.translate('data.search.aggs.buckets.significantTermsLabel', {
      defaultMessage: 'Top {size} unusual terms in {fieldName}',
      values: {
        size: aggConfig.params.size,
        fieldName: aggConfig.getFieldDisplayName()
      }
    });
  },

  createFilter: _terms.createFilterTerms,
  params: [{
    name: 'field',
    type: 'field',
    scriptable: false,
    filterFieldTypes: _common.KBN_FIELD_TYPES.STRING
  }, {
    name: 'size',
    default: ''
  }, {
    name: 'exclude',
    displayName: _i18n.i18n.translate('data.search.aggs.buckets.significantTerms.excludeLabel', {
      defaultMessage: 'Exclude'
    }),
    type: 'string',
    advanced: true,
    shouldShow: _migrate_include_exclude_format.isStringType,
    ..._migrate_include_exclude_format.migrateIncludeExcludeFormat
  }, {
    name: 'include',
    displayName: _i18n.i18n.translate('data.search.aggs.buckets.significantTerms.includeLabel', {
      defaultMessage: 'Include'
    }),
    type: 'string',
    advanced: true,
    shouldShow: _migrate_include_exclude_format.isStringType,
    ..._migrate_include_exclude_format.migrateIncludeExcludeFormat
  }]
});

exports.getSignificantTermsBucketAgg = getSignificantTermsBucketAgg;