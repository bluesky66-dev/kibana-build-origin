"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogEntryAnomaliesRequestPayloadRT = exports.getLogEntryAnomaliesSuccessReponsePayloadRT = exports.LOG_ANALYSIS_GET_LOG_ENTRY_ANOMALIES_PATH = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _shared = require("../../shared");

var _log_analysis = require("../../../log_analysis");

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


const LOG_ANALYSIS_GET_LOG_ENTRY_ANOMALIES_PATH = '/api/infra/log_analysis/results/log_entry_anomalies';
exports.LOG_ANALYSIS_GET_LOG_ENTRY_ANOMALIES_PATH = LOG_ANALYSIS_GET_LOG_ENTRY_ANOMALIES_PATH;
const getLogEntryAnomaliesSuccessReponsePayloadRT = rt.intersection([rt.type({
  data: rt.intersection([rt.type({
    anomalies: rt.array(_log_analysis.logEntryAnomalyRT),
    // Signifies there are more entries backwards or forwards. If this was a request
    // for a previous page, there are more previous pages, if this was a request for a next page,
    // there are more next pages.
    hasMoreEntries: rt.boolean
  }), rt.partial({
    paginationCursors: rt.type({
      // The cursor to use to fetch the previous page
      previousPageCursor: _log_analysis.paginationCursorRT,
      // The cursor to use to fetch the next page
      nextPageCursor: _log_analysis.paginationCursorRT
    })
  })])
}), rt.partial({
  timing: _shared.routeTimingMetadataRT
})]);
exports.getLogEntryAnomaliesSuccessReponsePayloadRT = getLogEntryAnomaliesSuccessReponsePayloadRT;
const getLogEntryAnomaliesRequestPayloadRT = rt.type({
  data: rt.intersection([rt.type({
    // the ID of the source configuration
    sourceId: rt.string,
    // the time range to fetch the log entry anomalies from
    timeRange: _shared.timeRangeRT
  }), rt.partial({
    // Pagination properties
    pagination: _log_analysis.paginationRT,
    // Sort properties
    sort: _log_analysis.anomaliesSortRT,
    // Dataset filters
    datasets: _log_analysis.logEntryAnomalyDatasetsRT
  })])
});
exports.getLogEntryAnomaliesRequestPayloadRT = getLogEntryAnomaliesRequestPayloadRT;