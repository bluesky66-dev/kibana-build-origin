"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitByTerms = splitByTerms;

var _helpers = require("../../helpers");

var _basic_aggs = require("../../../../../common/basic_aggs");

var _get_buckets_path = require("../../helpers/get_buckets_path");

var _bucket_transform = require("../../helpers/bucket_transform");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function splitByTerms(req, panel, series) {
  return next => doc => {
    if (series.split_mode === 'terms' && series.terms_field) {
      const termsField = series.terms_field;
      const orderByTerms = series.terms_order_by;
      const direction = series.terms_direction || 'desc';
      const metric = series.metrics.find(item => item.id === orderByTerms);
      (0, _helpers.overwrite)(doc, `aggs.${series.id}.terms.field`, termsField);
      (0, _helpers.overwrite)(doc, `aggs.${series.id}.terms.size`, series.terms_size);

      if (series.terms_include) {
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.terms.include`, series.terms_include);
      }

      if (series.terms_exclude) {
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.terms.exclude`, series.terms_exclude);
      }

      if (metric && metric.type !== 'count' && ~_basic_aggs.basicAggs.indexOf(metric.type)) {
        const sortAggKey = `${orderByTerms}-SORT`;
        const fn = _bucket_transform.bucketTransform[metric.type];
        const bucketPath = (0, _get_buckets_path.getBucketsPath)(orderByTerms, series.metrics).replace(orderByTerms, sortAggKey);
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.terms.order`, {
          [bucketPath]: direction
        });
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.aggs`, {
          [sortAggKey]: fn(metric)
        });
      } else if (['_key', '_count'].includes(orderByTerms)) {
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.terms.order`, {
          [orderByTerms]: direction
        });
      } else {
        (0, _helpers.overwrite)(doc, `aggs.${series.id}.terms.order`, {
          _count: direction
        });
      }
    }

    return next(doc);
  };
}