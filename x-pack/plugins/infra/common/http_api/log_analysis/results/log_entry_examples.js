"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogEntryExamplesResponsePayloadRT = exports.getLogEntryExamplesSuccessReponsePayloadRT = exports.getLogEntryExamplesRequestPayloadRT = exports.LOG_ANALYSIS_GET_LOG_ENTRY_RATE_EXAMPLES_PATH = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _log_analysis = require("../../../log_analysis");

var _shared = require("../../shared");

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


const LOG_ANALYSIS_GET_LOG_ENTRY_RATE_EXAMPLES_PATH = '/api/infra/log_analysis/results/log_entry_examples';
/**
 * request
 */

exports.LOG_ANALYSIS_GET_LOG_ENTRY_RATE_EXAMPLES_PATH = LOG_ANALYSIS_GET_LOG_ENTRY_RATE_EXAMPLES_PATH;
const getLogEntryExamplesRequestPayloadRT = rt.type({
  data: rt.intersection([rt.type({
    // the dataset to fetch the log rate examples from
    dataset: rt.string,
    // the number of examples to fetch
    exampleCount: rt.number,
    // the id of the source configuration
    sourceId: rt.string,
    // the time range to fetch the log rate examples from
    timeRange: _shared.timeRangeRT
  }), rt.partial({
    categoryId: rt.string
  })])
});
exports.getLogEntryExamplesRequestPayloadRT = getLogEntryExamplesRequestPayloadRT;
/**
 * response
 */

const getLogEntryExamplesSuccessReponsePayloadRT = rt.intersection([rt.type({
  data: rt.type({
    examples: rt.array(_log_analysis.logEntryExampleRT)
  })
}), rt.partial({
  timing: _shared.routeTimingMetadataRT
})]);
exports.getLogEntryExamplesSuccessReponsePayloadRT = getLogEntryExamplesSuccessReponsePayloadRT;
const getLogEntryExamplesResponsePayloadRT = rt.union([getLogEntryExamplesSuccessReponsePayloadRT, _shared.badRequestErrorRT, _shared.forbiddenErrorRT]);
exports.getLogEntryExamplesResponsePayloadRT = getLogEntryExamplesResponsePayloadRT;