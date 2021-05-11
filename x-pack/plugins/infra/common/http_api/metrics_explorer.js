"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricsExplorerResponseRT = exports.metricsExplorerSeriesRT = exports.metricsExplorerRowRT = exports.metricsExplorerColumnRT = exports.metricsExplorerColumnTypeRT = exports.metricsExplorerPageInfoRT = exports.metricsExplorerRequestBodyRT = exports.metricsExplorerRequestBodyOptionalFieldsRT = exports.afterKeyObjectRT = exports.metricsExplorerRequestBodyRequiredFieldsRT = exports.timeRangeRT = exports.metricsExplorerMetricRT = exports.metricsExplorerMetricOptionalFieldsRT = exports.metricsExplorerMetricRequiredFieldsRT = exports.metricsExplorerAggregationRT = exports.METRIC_EXPLORER_AGGREGATIONS = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const METRIC_EXPLORER_AGGREGATIONS = ['avg', 'max', 'min', 'cardinality', 'rate', 'count', 'sum', 'p95', 'p99'];
exports.METRIC_EXPLORER_AGGREGATIONS = METRIC_EXPLORER_AGGREGATIONS;
const metricsExplorerAggregationKeys = METRIC_EXPLORER_AGGREGATIONS.reduce((acc, agg) => ({ ...acc,
  [agg]: null
}), {});
const metricsExplorerAggregationRT = rt.keyof(metricsExplorerAggregationKeys);
exports.metricsExplorerAggregationRT = metricsExplorerAggregationRT;
const metricsExplorerMetricRequiredFieldsRT = rt.type({
  aggregation: metricsExplorerAggregationRT
});
exports.metricsExplorerMetricRequiredFieldsRT = metricsExplorerMetricRequiredFieldsRT;
const metricsExplorerMetricOptionalFieldsRT = rt.partial({
  field: rt.union([rt.string, rt.undefined])
});
exports.metricsExplorerMetricOptionalFieldsRT = metricsExplorerMetricOptionalFieldsRT;
const metricsExplorerMetricRT = rt.intersection([metricsExplorerMetricRequiredFieldsRT, metricsExplorerMetricOptionalFieldsRT]);
exports.metricsExplorerMetricRT = metricsExplorerMetricRT;
const timeRangeRT = rt.type({
  field: rt.string,
  from: rt.number,
  to: rt.number,
  interval: rt.string
});
exports.timeRangeRT = timeRangeRT;
const metricsExplorerRequestBodyRequiredFieldsRT = rt.type({
  timerange: timeRangeRT,
  indexPattern: rt.string,
  metrics: rt.array(metricsExplorerMetricRT)
});
exports.metricsExplorerRequestBodyRequiredFieldsRT = metricsExplorerRequestBodyRequiredFieldsRT;
const groupByRT = rt.union([rt.string, rt.null, rt.undefined]);
const afterKeyObjectRT = rt.record(rt.string, rt.union([rt.string, rt.null]));
exports.afterKeyObjectRT = afterKeyObjectRT;
const metricsExplorerRequestBodyOptionalFieldsRT = rt.partial({
  groupBy: rt.union([groupByRT, rt.array(groupByRT)]),
  afterKey: rt.union([rt.string, rt.null, rt.undefined, afterKeyObjectRT]),
  limit: rt.union([rt.number, rt.null, rt.undefined]),
  filterQuery: rt.union([rt.string, rt.null, rt.undefined]),
  forceInterval: rt.boolean,
  dropLastBucket: rt.boolean
});
exports.metricsExplorerRequestBodyOptionalFieldsRT = metricsExplorerRequestBodyOptionalFieldsRT;
const metricsExplorerRequestBodyRT = rt.intersection([metricsExplorerRequestBodyRequiredFieldsRT, metricsExplorerRequestBodyOptionalFieldsRT]);
exports.metricsExplorerRequestBodyRT = metricsExplorerRequestBodyRT;
const metricsExplorerPageInfoRT = rt.type({
  total: rt.number,
  afterKey: rt.union([rt.string, rt.null, afterKeyObjectRT])
});
exports.metricsExplorerPageInfoRT = metricsExplorerPageInfoRT;
const metricsExplorerColumnTypeRT = rt.keyof({
  date: null,
  number: null,
  string: null
});
exports.metricsExplorerColumnTypeRT = metricsExplorerColumnTypeRT;
const metricsExplorerColumnRT = rt.type({
  name: rt.string,
  type: metricsExplorerColumnTypeRT
});
exports.metricsExplorerColumnRT = metricsExplorerColumnRT;
const metricsExplorerRowRT = rt.intersection([rt.type({
  timestamp: rt.number
}), rt.record(rt.string, rt.union([rt.string, rt.number, rt.null, rt.undefined, rt.array(rt.object)]))]);
exports.metricsExplorerRowRT = metricsExplorerRowRT;
const metricsExplorerSeriesRT = rt.intersection([rt.type({
  id: rt.string,
  columns: rt.array(metricsExplorerColumnRT),
  rows: rt.array(metricsExplorerRowRT)
}), rt.partial({
  keys: rt.array(rt.string)
})]);
exports.metricsExplorerSeriesRT = metricsExplorerSeriesRT;
const metricsExplorerResponseRT = rt.type({
  series: rt.array(metricsExplorerSeriesRT),
  pageInfo: metricsExplorerPageInfoRT
});
exports.metricsExplorerResponseRT = metricsExplorerResponseRT;