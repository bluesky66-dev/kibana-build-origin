"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogEntryCategoriesResponsePayloadRT = exports.getLogEntryCategoriesSuccessReponsePayloadRT = exports.getLogEntryCategoriesRequestPayloadRT = exports.LOG_ANALYSIS_GET_LOG_ENTRY_CATEGORIES_PATH = void 0;

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


const LOG_ANALYSIS_GET_LOG_ENTRY_CATEGORIES_PATH = '/api/infra/log_analysis/results/log_entry_categories';
/**
 * request
 */

exports.LOG_ANALYSIS_GET_LOG_ENTRY_CATEGORIES_PATH = LOG_ANALYSIS_GET_LOG_ENTRY_CATEGORIES_PATH;
const logEntryCategoriesHistogramParametersRT = rt.type({
  id: rt.string,
  timeRange: _shared.timeRangeRT,
  bucketCount: rt.number
});
const getLogEntryCategoriesRequestPayloadRT = rt.type({
  data: rt.intersection([rt.type({
    // the number of categories to fetch
    categoryCount: rt.number,
    // the id of the source configuration
    sourceId: rt.string,
    // the time range to fetch the categories from
    timeRange: _shared.timeRangeRT,
    // a list of histograms to create
    histograms: rt.array(logEntryCategoriesHistogramParametersRT),
    // the criteria to the categories by
    sort: _log_analysis.categoriesSortRT
  }), rt.partial({
    // the datasets to filter for (optional, unfiltered if not present)
    datasets: rt.array(rt.string)
  })])
});
exports.getLogEntryCategoriesRequestPayloadRT = getLogEntryCategoriesRequestPayloadRT;
/**
 * response
 */

const getLogEntryCategoriesSuccessReponsePayloadRT = rt.intersection([rt.type({
  data: rt.type({
    categories: rt.array(_log_analysis.logEntryCategoryRT)
  })
}), rt.partial({
  timing: _shared.routeTimingMetadataRT
})]);
exports.getLogEntryCategoriesSuccessReponsePayloadRT = getLogEntryCategoriesSuccessReponsePayloadRT;
const getLogEntryCategoriesResponsePayloadRT = rt.union([getLogEntryCategoriesSuccessReponsePayloadRT, _shared.badRequestErrorRT, _shared.forbiddenErrorRT]);
exports.getLogEntryCategoriesResponsePayloadRT = getLogEntryCategoriesResponsePayloadRT;