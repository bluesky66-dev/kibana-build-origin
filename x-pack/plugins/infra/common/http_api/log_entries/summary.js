"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntriesSummaryResponseRT = exports.logEntriesSummaryBucketRT = exports.logEntriesSummaryRequestRT = exports.LOG_ENTRIES_SUMMARY_PATH = void 0;

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


const LOG_ENTRIES_SUMMARY_PATH = '/api/log_entries/summary';
exports.LOG_ENTRIES_SUMMARY_PATH = LOG_ENTRIES_SUMMARY_PATH;
const logEntriesSummaryRequestRT = rt.type({
  sourceId: rt.string,
  startTimestamp: rt.number,
  endTimestamp: rt.number,
  bucketSize: rt.number,
  query: rt.union([rt.string, rt.undefined, rt.null])
});
exports.logEntriesSummaryRequestRT = logEntriesSummaryRequestRT;
const logEntriesSummaryBucketRT = rt.type({
  start: rt.number,
  end: rt.number,
  entriesCount: rt.number
});
exports.logEntriesSummaryBucketRT = logEntriesSummaryBucketRT;
const logEntriesSummaryResponseRT = rt.type({
  data: rt.type({
    start: rt.number,
    end: rt.number,
    buckets: rt.array(logEntriesSummaryBucketRT)
  })
});
exports.logEntriesSummaryResponseRT = logEntriesSummaryResponseRT;