"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatencyAggregation = getLatencyAggregation;
exports.getLatencyValue = getLatencyValue;

var _latency_aggregation_types = require("../../../../common/latency_aggregation_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getLatencyAggregation(latencyAggregationType, field) {
  return {
    latency: { ...(latencyAggregationType === _latency_aggregation_types.LatencyAggregationType.avg ? {
        avg: {
          field
        }
      } : {
        percentiles: {
          field,
          percents: [latencyAggregationType === _latency_aggregation_types.LatencyAggregationType.p95 ? 95 : 99]
        }
      })
    }
  };
}

function getLatencyValue({
  latencyAggregationType,
  aggregation
}) {
  if ('value' in aggregation) {
    return aggregation.value;
  }

  if ('values' in aggregation) {
    if (latencyAggregationType === _latency_aggregation_types.LatencyAggregationType.p95) {
      return aggregation.values['95.0'];
    }

    if (latencyAggregationType === _latency_aggregation_types.LatencyAggregationType.p99) {
      return aggregation.values['99.0'];
    }
  }

  return null;
}