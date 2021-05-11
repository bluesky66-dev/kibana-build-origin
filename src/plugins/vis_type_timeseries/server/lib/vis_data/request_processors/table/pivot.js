"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pivot = pivot;

var _lodash = require("lodash");

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
function pivot(req, panel) {
  return next => doc => {
    const {
      sort
    } = req.payload.state;

    if (panel.pivot_id) {
      (0, _helpers.overwrite)(doc, 'aggs.pivot.terms.field', panel.pivot_id);
      (0, _helpers.overwrite)(doc, 'aggs.pivot.terms.size', panel.pivot_rows);

      if (sort) {
        const series = panel.series.find(item => item.id === sort.column);
        const metric = series && (0, _lodash.last)(series.metrics);

        if (metric && metric.type === 'count') {
          (0, _helpers.overwrite)(doc, 'aggs.pivot.terms.order', {
            _count: sort.order
          });
        } else if (metric && _basic_aggs.basicAggs.includes(metric.type)) {
          const sortAggKey = `${metric.id}-SORT`;
          const fn = _bucket_transform.bucketTransform[metric.type];
          const bucketPath = (0, _get_buckets_path.getBucketsPath)(metric.id, series.metrics).replace(metric.id, sortAggKey);
          (0, _helpers.overwrite)(doc, `aggs.pivot.terms.order`, {
            [bucketPath]: sort.order
          });
          (0, _helpers.overwrite)(doc, `aggs.pivot.aggs`, {
            [sortAggKey]: fn(metric)
          });
        } else {
          (0, _helpers.overwrite)(doc, 'aggs.pivot.terms.order', {
            _key: (0, _lodash.get)(sort, 'order', 'asc')
          });
        }
      }
    } else {
      (0, _helpers.overwrite)(doc, 'aggs.pivot.filter.match_all', {});
    }

    return next(doc);
  };
}