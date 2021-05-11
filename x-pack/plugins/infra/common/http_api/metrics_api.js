"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricsAPIResponseRT = exports.MetricsAPISeriesRT = exports.MetricsAPIRowRT = exports.MetricsAPIColumnRT = exports.MetricsAPIColumnTypeRT = exports.MetricsAPIPageInfoRT = exports.MetricsAPIRequestRT = exports.MetricsAPIMetricRT = exports.MetricsAPITimerangeRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _types = require("../inventory_models/types");

var _metrics_explorer = require("./metrics_explorer");

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


const MetricsAPITimerangeRT = rt.type({
  field: rt.string,
  from: rt.number,
  to: rt.number,
  interval: rt.string
});
exports.MetricsAPITimerangeRT = MetricsAPITimerangeRT;
const groupByRT = rt.union([rt.string, rt.null, rt.undefined]);
const MetricsAPIMetricRT = rt.type({
  id: rt.string,
  aggregations: _types.MetricsUIAggregationRT
});
exports.MetricsAPIMetricRT = MetricsAPIMetricRT;
const MetricsAPIRequestRT = rt.intersection([rt.type({
  timerange: MetricsAPITimerangeRT,
  indexPattern: rt.string,
  metrics: rt.array(MetricsAPIMetricRT)
}), rt.partial({
  groupBy: rt.array(groupByRT),
  modules: rt.array(rt.string),
  afterKey: rt.union([rt.null, _metrics_explorer.afterKeyObjectRT]),
  limit: rt.union([rt.number, rt.null, rt.undefined]),
  filters: rt.array(rt.object),
  dropLastBucket: rt.boolean,
  alignDataToEnd: rt.boolean
})]);
exports.MetricsAPIRequestRT = MetricsAPIRequestRT;
const MetricsAPIPageInfoRT = rt.type({
  afterKey: rt.union([rt.null, _metrics_explorer.afterKeyObjectRT, rt.undefined]),
  interval: rt.number
});
exports.MetricsAPIPageInfoRT = MetricsAPIPageInfoRT;
const MetricsAPIColumnTypeRT = rt.keyof({
  date: null,
  number: null,
  string: null
});
exports.MetricsAPIColumnTypeRT = MetricsAPIColumnTypeRT;
const MetricsAPIColumnRT = rt.type({
  name: rt.string,
  type: MetricsAPIColumnTypeRT
});
exports.MetricsAPIColumnRT = MetricsAPIColumnRT;
const MetricsAPIRowRT = rt.intersection([rt.type({
  timestamp: rt.number
}), rt.record(rt.string, rt.union([rt.string, rt.number, rt.null, rt.undefined, rt.array(rt.object)]))]);
exports.MetricsAPIRowRT = MetricsAPIRowRT;
const MetricsAPISeriesRT = rt.intersection([rt.type({
  id: rt.string,
  columns: rt.array(MetricsAPIColumnRT),
  rows: rt.array(MetricsAPIRowRT)
}), rt.partial({
  keys: rt.array(rt.string)
})]);
exports.MetricsAPISeriesRT = MetricsAPISeriesRT;
const MetricsAPIResponseRT = rt.type({
  series: rt.array(MetricsAPISeriesRT),
  info: MetricsAPIPageInfoRT
});
exports.MetricsAPIResponseRT = MetricsAPIResponseRT;