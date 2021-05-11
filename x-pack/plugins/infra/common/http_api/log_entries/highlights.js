"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntriesHighlightsResponseRT = exports.logEntriesHighlightsRequestRT = exports.logEntriesHighlightsCenteredRequestRT = exports.logEntriesHighlightsAfterRequestRT = exports.logEntriesHighlightsBeforeRequestRT = exports.logEntriesHighlightsBaseRequestRT = exports.LOG_ENTRIES_HIGHLIGHTS_PATH = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _log_entry = require("../../log_entry");

var _log_sources = require("../log_sources");

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


const LOG_ENTRIES_HIGHLIGHTS_PATH = '/api/log_entries/highlights';
exports.LOG_ENTRIES_HIGHLIGHTS_PATH = LOG_ENTRIES_HIGHLIGHTS_PATH;
const logEntriesHighlightsBaseRequestRT = rt.intersection([rt.type({
  sourceId: rt.string,
  startTimestamp: rt.number,
  endTimestamp: rt.number,
  highlightTerms: rt.array(rt.string)
}), rt.partial({
  query: rt.union([rt.string, rt.null]),
  size: rt.number,
  columns: rt.array(_log_sources.logSourceColumnConfigurationRT)
})]);
exports.logEntriesHighlightsBaseRequestRT = logEntriesHighlightsBaseRequestRT;
const logEntriesHighlightsBeforeRequestRT = rt.intersection([logEntriesHighlightsBaseRequestRT, rt.type({
  before: rt.union([_log_entry.logEntryCursorRT, rt.literal('last')])
})]);
exports.logEntriesHighlightsBeforeRequestRT = logEntriesHighlightsBeforeRequestRT;
const logEntriesHighlightsAfterRequestRT = rt.intersection([logEntriesHighlightsBaseRequestRT, rt.type({
  after: rt.union([_log_entry.logEntryCursorRT, rt.literal('first')])
})]);
exports.logEntriesHighlightsAfterRequestRT = logEntriesHighlightsAfterRequestRT;
const logEntriesHighlightsCenteredRequestRT = rt.intersection([logEntriesHighlightsBaseRequestRT, rt.type({
  center: _log_entry.logEntryCursorRT
})]);
exports.logEntriesHighlightsCenteredRequestRT = logEntriesHighlightsCenteredRequestRT;
const logEntriesHighlightsRequestRT = rt.union([logEntriesHighlightsBaseRequestRT, logEntriesHighlightsBeforeRequestRT, logEntriesHighlightsAfterRequestRT, logEntriesHighlightsCenteredRequestRT]);
exports.logEntriesHighlightsRequestRT = logEntriesHighlightsRequestRT;
const logEntriesHighlightsResponseRT = rt.type({
  data: rt.array(rt.union([rt.type({
    topCursor: rt.null,
    bottomCursor: rt.null,
    entries: rt.array(_log_entry.logEntryRT)
  }), rt.type({
    topCursor: _log_entry.logEntryCursorRT,
    bottomCursor: _log_entry.logEntryCursorRT,
    entries: rt.array(_log_entry.logEntryRT)
  })]))
});
exports.logEntriesHighlightsResponseRT = logEntriesHighlightsResponseRT;