"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.siblingPipelineAggWriter = void 0;

var _metric_agg_types = require("../metric_agg_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const siblingPipelineAggWriter = (agg, output) => {
  const customMetric = agg.getParam('customMetric');
  if (!customMetric) return;
  const metricAgg = customMetric;
  const bucketAgg = agg.getParam('customBucket'); // if a bucket is selected, we must add this agg as a sibling to it, and add a metric to that bucket (or select one of its)

  if (metricAgg.type.name !== _metric_agg_types.METRIC_TYPES.COUNT) {
    bucketAgg.subAggs = (output.subAggs || []).concat(metricAgg);
    output.params.buckets_path = `${bucketAgg.id}>${metricAgg.id}`;
  } else {
    output.params.buckets_path = bucketAgg.id + '>_count';
  }

  output.parentAggs = (output.parentAggs || []).concat(bucketAgg);
};

exports.siblingPipelineAggWriter = siblingPipelineAggWriter;