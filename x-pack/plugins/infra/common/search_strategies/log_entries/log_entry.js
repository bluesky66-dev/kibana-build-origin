"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntrySearchResponsePayloadRT = exports.logEntryRT = exports.logEntrySearchRequestParamsRT = exports.LOG_ENTRY_SEARCH_STRATEGY = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _log_entry = require("../../log_entry");

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


const LOG_ENTRY_SEARCH_STRATEGY = 'infra-log-entry';
exports.LOG_ENTRY_SEARCH_STRATEGY = LOG_ENTRY_SEARCH_STRATEGY;
const logEntrySearchRequestParamsRT = rt.type({
  sourceId: rt.string,
  logEntryId: rt.string
});
exports.logEntrySearchRequestParamsRT = logEntrySearchRequestParamsRT;
const logEntryRT = rt.type({
  id: rt.string,
  index: rt.string,
  fields: rt.array(_log_entry.logEntryFieldRT),
  cursor: _log_entry.logEntryCursorRT
});
exports.logEntryRT = logEntryRT;
const logEntrySearchResponsePayloadRT = rt.intersection([rt.type({
  data: rt.union([logEntryRT, rt.null])
}), rt.partial({
  errors: rt.array(_errors.searchStrategyErrorRT)
})]);
exports.logEntrySearchResponsePayloadRT = logEntrySearchResponsePayloadRT;