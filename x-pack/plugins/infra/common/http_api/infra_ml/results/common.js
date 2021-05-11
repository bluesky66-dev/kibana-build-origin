"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricRT = exports.sortRT = exports.paginationRT = exports.anomalyTypeRT = exports.paginationCursorRT = void 0;

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
// [Sort field value, tiebreaker value]


const paginationCursorRT = rt.tuple([rt.union([rt.string, rt.number]), rt.union([rt.string, rt.number])]);
exports.paginationCursorRT = paginationCursorRT;
const anomalyTypeRT = rt.keyof({
  metrics_hosts: null,
  metrics_k8s: null
});
exports.anomalyTypeRT = anomalyTypeRT;
const sortOptionsRT = rt.keyof({
  anomalyScore: null,
  dataset: null,
  startTime: null
});
const sortDirectionsRT = rt.keyof({
  asc: null,
  desc: null
});
const paginationPreviousPageCursorRT = rt.type({
  searchBefore: paginationCursorRT
});
const paginationNextPageCursorRT = rt.type({
  searchAfter: paginationCursorRT
});
const paginationRT = rt.intersection([rt.type({
  pageSize: rt.number
}), rt.partial({
  cursor: rt.union([paginationPreviousPageCursorRT, paginationNextPageCursorRT])
})]);
exports.paginationRT = paginationRT;
const sortRT = rt.type({
  field: sortOptionsRT,
  direction: sortDirectionsRT
});
exports.sortRT = sortRT;
const metricRT = rt.keyof({
  memory_usage: null,
  network_in: null,
  network_out: null
});
exports.metricRT = metricRT;