"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnapshotRequestRT = exports.SnapshotMetricInputRT = exports.SnapshotCustomMetricInputRT = exports.SnapshotCustomAggregationRT = exports.SNAPSHOT_CUSTOM_AGGREGATIONS = exports.SnapshotNamedMetricInputRT = exports.SnapshotGroupByRT = exports.InfraTimerangeInputRT = exports.SnapshotNodeResponseRT = exports.SnapshotNodeRT = exports.SnapshotNodeMetricRT = exports.SnapshotNodePathRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _types = require("../inventory_models/types");

var _metrics_api = require("./metrics_api");

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


const SnapshotNodePathRT = rt.intersection([rt.type({
  value: rt.string,
  label: rt.string
}), rt.partial({
  ip: rt.union([rt.string, rt.null])
})]);
exports.SnapshotNodePathRT = SnapshotNodePathRT;
const SnapshotNodeMetricOptionalRT = rt.partial({
  value: rt.union([rt.number, rt.null]),
  avg: rt.union([rt.number, rt.null]),
  max: rt.union([rt.number, rt.null]),
  timeseries: _metrics_api.MetricsAPISeriesRT
});
const SnapshotNodeMetricRequiredRT = rt.type({
  name: rt.union([_types.SnapshotMetricTypeRT, rt.string])
});
const SnapshotNodeMetricRT = rt.intersection([SnapshotNodeMetricRequiredRT, SnapshotNodeMetricOptionalRT]);
exports.SnapshotNodeMetricRT = SnapshotNodeMetricRT;
const SnapshotNodeRT = rt.type({
  metrics: rt.array(SnapshotNodeMetricRT),
  path: rt.array(SnapshotNodePathRT),
  name: rt.string
});
exports.SnapshotNodeRT = SnapshotNodeRT;
const SnapshotNodeResponseRT = rt.type({
  nodes: rt.array(SnapshotNodeRT),
  interval: rt.string
});
exports.SnapshotNodeResponseRT = SnapshotNodeResponseRT;
const InfraTimerangeInputRT = rt.intersection([rt.type({
  interval: rt.string,
  to: rt.number,
  from: rt.number
}), rt.partial({
  lookbackSize: rt.number,
  ignoreLookback: rt.boolean,
  forceInterval: rt.boolean
})]);
exports.InfraTimerangeInputRT = InfraTimerangeInputRT;
const SnapshotGroupByRT = rt.array(rt.partial({
  label: rt.union([rt.string, rt.null]),
  field: rt.union([rt.string, rt.null])
}));
exports.SnapshotGroupByRT = SnapshotGroupByRT;
const SnapshotNamedMetricInputRT = rt.type({
  type: _types.SnapshotMetricTypeRT
});
exports.SnapshotNamedMetricInputRT = SnapshotNamedMetricInputRT;
const SNAPSHOT_CUSTOM_AGGREGATIONS = ['avg', 'max', 'min', 'rate'];
exports.SNAPSHOT_CUSTOM_AGGREGATIONS = SNAPSHOT_CUSTOM_AGGREGATIONS;
const snapshotCustomAggregationKeys = SNAPSHOT_CUSTOM_AGGREGATIONS.reduce((acc, agg) => ({ ...acc,
  [agg]: null
}), {});
const SnapshotCustomAggregationRT = rt.keyof(snapshotCustomAggregationKeys);
exports.SnapshotCustomAggregationRT = SnapshotCustomAggregationRT;
const SnapshotCustomMetricInputRT = rt.intersection([rt.type({
  type: rt.literal('custom'),
  field: rt.string,
  aggregation: SnapshotCustomAggregationRT,
  id: rt.string
}), rt.partial({
  label: rt.string
})]);
exports.SnapshotCustomMetricInputRT = SnapshotCustomMetricInputRT;
const SnapshotMetricInputRT = rt.union([SnapshotNamedMetricInputRT, SnapshotCustomMetricInputRT]);
exports.SnapshotMetricInputRT = SnapshotMetricInputRT;
const SnapshotRequestRT = rt.intersection([rt.type({
  timerange: InfraTimerangeInputRT,
  metrics: rt.array(SnapshotMetricInputRT),
  groupBy: rt.union([SnapshotGroupByRT, rt.null]),
  nodeType: _types.ItemTypeRT,
  sourceId: rt.string
}), rt.partial({
  accountId: rt.string,
  region: rt.string,
  filterQuery: rt.union([rt.string, rt.null]),
  includeTimeseries: rt.boolean,
  overrideCompositeSize: rt.number
})]);
exports.SnapshotRequestRT = SnapshotRequestRT;