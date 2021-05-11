"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OverviewRequestRT = exports.OverviewResponseRT = exports.OverviewMetricRT = exports.OverviewMetricTypeRT = void 0;

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


const OverviewMetricTypeRT = rt.keyof({
  percent: null,
  number: null,
  bytesPerSecond: null
});
exports.OverviewMetricTypeRT = OverviewMetricTypeRT;
const OverviewMetricRT = rt.type({
  type: rt.string,
  value: rt.number
});
exports.OverviewMetricRT = OverviewMetricRT;
const OverviewResponseRT = rt.type({
  stats: rt.type({
    hosts: OverviewMetricRT,
    cpu: OverviewMetricRT,
    memory: OverviewMetricRT
  })
});
exports.OverviewResponseRT = OverviewResponseRT;
const OverviewRequestRT = rt.type({
  sourceId: rt.string,
  timerange: rt.type({
    from: rt.number,
    to: rt.number
  })
});
exports.OverviewRequestRT = OverviewRequestRT;