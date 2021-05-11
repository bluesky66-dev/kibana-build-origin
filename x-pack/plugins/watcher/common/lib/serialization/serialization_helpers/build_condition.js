"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCondition = buildCondition;

var _single_line_script = require("./single_line_script");

var _constants = require("../../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  BETWEEN
} = _constants.COMPARATORS;
/*
watch.condition.script.inline
 */

function buildInline(aggType, thresholdComparator, hasTermsAgg) {
  let script = '';

  if (aggType === 'count' && !hasTermsAgg) {
    if (thresholdComparator === BETWEEN) {
      script = `
      if (ctx.payload.hits.total >= params.threshold[0] && ctx.payload.hits.total <= params.threshold[1]) {
        return true;
      }

      return false;
    `;
    } else {
      script = `
      if (ctx.payload.hits.total ${thresholdComparator} params.threshold) {
        return true;
      }

      return false;
    `;
    }
  }

  if (aggType === 'count' && hasTermsAgg) {
    if (thresholdComparator === BETWEEN) {
      script = `
      ArrayList arr = ctx.payload.aggregations.bucketAgg.buckets;
      for (int i = 0; i < arr.length; i++) {
        if (arr[i].doc_count >= params.threshold[0] && arr[i].doc_count <= params.threshold[1]) {
          return true;
        }
      }

      return false;
    `;
    } else {
      script = `
      ArrayList arr = ctx.payload.aggregations.bucketAgg.buckets;
      for (int i = 0; i < arr.length; i++) {
        if (arr[i].doc_count ${thresholdComparator} params.threshold) {
          return true;
        }
      }

      return false;
    `;
    }
  }

  if (aggType !== 'count' && !hasTermsAgg) {
    if (thresholdComparator === BETWEEN) {
      script = `
      if (ctx.payload.aggregations.metricAgg.value >= params.threshold[0]
        && ctx.payload.aggregations.metricAgg.value <= params.threshold[1]) {
        return true;
      }

      return false;
    `;
    } else {
      script = `
      if (ctx.payload.aggregations.metricAgg.value ${thresholdComparator} params.threshold) {
        return true;
      }

      return false;
    `;
    }
  }

  if (aggType !== 'count' && hasTermsAgg) {
    if (thresholdComparator === BETWEEN) {
      script = `
      ArrayList arr = ctx.payload.aggregations.bucketAgg.buckets;
      for (int i = 0; i < arr.length; i++) {
        if (arr[i]['metricAgg'].value >= params.threshold[0] && arr[i]['metricAgg'].value <= params.threshold[1]) {
          return true;
        }
      }

      return false;
    `;
    } else {
      script = `
      ArrayList arr = ctx.payload.aggregations.bucketAgg.buckets;
      for (int i = 0; i < arr.length; i++) {
        if (arr[i]['metricAgg'].value ${thresholdComparator} params.threshold) {
          return true;
        }
      }

      return false;
    `;
    }
  }

  return (0, _single_line_script.singleLineScript)(script);
}
/*
watch.condition.script.params
 */


function buildParams(threshold) {
  return {
    threshold
  };
}
/*
watch.condition
 */


function buildCondition({
  aggType,
  thresholdComparator,
  hasTermsAgg,
  threshold
}) {
  return {
    script: {
      source: buildInline(aggType, thresholdComparator, hasTermsAgg),
      params: buildParams(threshold)
    }
  };
}