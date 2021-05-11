"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAggregations = void 0;

var _calculate_date_histogram_offset = require("./calculate_date_histogram_offset");

var _create_metrics_aggregations = require("./create_metrics_aggregations");

var _calculate_bucket_size = require("./calculate_bucket_size");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createAggregations = options => {
  const {
    intervalString
  } = (0, _calculate_bucket_size.calculateBucketSize)(options.timerange);
  const histogramAggregation = {
    histogram: {
      date_histogram: {
        field: options.timerange.field,
        fixed_interval: intervalString,
        offset: options.alignDataToEnd ? (0, _calculate_date_histogram_offset.calculateDateHistogramOffset)(options.timerange) : '0s',
        extended_bounds: {
          min: options.timerange.from,
          max: options.timerange.to
        }
      },
      aggregations: (0, _create_metrics_aggregations.createMetricsAggregations)(options)
    }
  };

  if (Array.isArray(options.groupBy) && options.groupBy.length) {
    const limit = options.limit || 9;
    return {
      groupings: {
        composite: {
          size: limit,
          sources: options.groupBy.map((field, index) => ({
            [`groupBy${index}`]: {
              terms: {
                field
              }
            }
          }))
        },
        aggs: histogramAggregation
      }
    };
  }

  return histogramAggregation;
};

exports.createAggregations = createAggregations;