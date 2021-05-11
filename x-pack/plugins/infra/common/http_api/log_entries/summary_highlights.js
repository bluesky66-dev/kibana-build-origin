"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntriesSummaryHighlightsResponseRT = exports.logEntriesSummaryHighlightsBucketRT = exports.logEntriesSummaryHighlightsRequestRT = exports.LOG_ENTRIES_SUMMARY_HIGHLIGHTS_PATH = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _log_entry = require("../../log_entry");

var _summary = require("./summary");

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


const LOG_ENTRIES_SUMMARY_HIGHLIGHTS_PATH = '/api/log_entries/summary_highlights';
exports.LOG_ENTRIES_SUMMARY_HIGHLIGHTS_PATH = LOG_ENTRIES_SUMMARY_HIGHLIGHTS_PATH;
const logEntriesSummaryHighlightsRequestRT = rt.intersection([_summary.logEntriesSummaryRequestRT, rt.type({
  highlightTerms: rt.array(rt.string)
})]);
exports.logEntriesSummaryHighlightsRequestRT = logEntriesSummaryHighlightsRequestRT;
const logEntriesSummaryHighlightsBucketRT = rt.intersection([_summary.logEntriesSummaryBucketRT, rt.type({
  representativeKey: _log_entry.logEntryCursorRT
})]);
exports.logEntriesSummaryHighlightsBucketRT = logEntriesSummaryHighlightsBucketRT;
const logEntriesSummaryHighlightsResponseRT = rt.type({
  data: rt.array(rt.type({
    start: rt.number,
    end: rt.number,
    buckets: rt.array(logEntriesSummaryHighlightsBucketRT)
  }))
});
exports.logEntriesSummaryHighlightsResponseRT = logEntriesSummaryHighlightsResponseRT;