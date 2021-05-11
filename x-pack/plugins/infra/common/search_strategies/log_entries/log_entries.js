"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntriesSearchResponsePayloadRT = exports.logEntriesSearchRequestParamsRT = exports.logEntriesAfterSearchRequestParamsRT = exports.logEntriesBeforeSearchRequestParamsRT = exports.LOG_ENTRIES_SEARCH_STRATEGY = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _log_sources = require("../../http_api/log_sources");

var _log_entry = require("../../log_entry");

var _typed_json = require("../../typed_json");

var _errors = require("../common/errors");

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


const LOG_ENTRIES_SEARCH_STRATEGY = 'infra-log-entries';
exports.LOG_ENTRIES_SEARCH_STRATEGY = LOG_ENTRIES_SEARCH_STRATEGY;
const logEntriesBaseSearchRequestParamsRT = rt.intersection([rt.type({
  sourceId: rt.string,
  startTimestamp: rt.number,
  endTimestamp: rt.number,
  size: rt.number
}), rt.partial({
  query: _typed_json.jsonObjectRT,
  columns: rt.array(_log_sources.logSourceColumnConfigurationRT),
  highlightPhrase: rt.string
})]);
const logEntriesBeforeSearchRequestParamsRT = rt.intersection([logEntriesBaseSearchRequestParamsRT, _log_entry.logEntryBeforeCursorRT]);
exports.logEntriesBeforeSearchRequestParamsRT = logEntriesBeforeSearchRequestParamsRT;
const logEntriesAfterSearchRequestParamsRT = rt.intersection([logEntriesBaseSearchRequestParamsRT, _log_entry.logEntryAfterCursorRT]);
exports.logEntriesAfterSearchRequestParamsRT = logEntriesAfterSearchRequestParamsRT;
const logEntriesSearchRequestParamsRT = rt.union([logEntriesBaseSearchRequestParamsRT, logEntriesBeforeSearchRequestParamsRT, logEntriesAfterSearchRequestParamsRT]);
exports.logEntriesSearchRequestParamsRT = logEntriesSearchRequestParamsRT;
const logEntriesSearchResponsePayloadRT = rt.intersection([rt.type({
  data: rt.intersection([rt.type({
    entries: rt.array(_log_entry.logEntryRT),
    topCursor: rt.union([_log_entry.logEntryCursorRT, rt.null]),
    bottomCursor: rt.union([_log_entry.logEntryCursorRT, rt.null])
  }), rt.partial({
    hasMoreBefore: rt.boolean,
    hasMoreAfter: rt.boolean
  })])
}), rt.partial({
  errors: rt.array(_errors.searchStrategyErrorRT)
})]);
exports.logEntriesSearchResponsePayloadRT = logEntriesSearchResponsePayloadRT;