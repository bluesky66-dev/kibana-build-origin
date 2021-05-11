"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatestLogEntryCategoryDatasetsStatsSuccessResponsePayloadRT = exports.getLatestLogEntryCategoryDatasetsStatsRequestPayloadRT = exports.LOG_ANALYSIS_GET_LATEST_LOG_ENTRY_CATEGORY_DATASETS_STATS_PATH = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

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


const LOG_ANALYSIS_GET_LATEST_LOG_ENTRY_CATEGORY_DATASETS_STATS_PATH = '/api/infra/log_analysis/results/latest_log_entry_category_datasets_stats';
exports.LOG_ANALYSIS_GET_LATEST_LOG_ENTRY_CATEGORY_DATASETS_STATS_PATH = LOG_ANALYSIS_GET_LATEST_LOG_ENTRY_CATEGORY_DATASETS_STATS_PATH;
const categorizerStatusRT = rt.keyof({
  ok: null,
  warn: null
});
/**
 * request
 */

const getLatestLogEntryCategoryDatasetsStatsRequestPayloadRT = rt.type({
  data: rt.type({
    // the ids of the categorization jobs
    jobIds: rt.array(rt.string),
    // the time range to fetch the category datasets stats for
    timeRange: _shared.timeRangeRT,
    // the categorizer statuses to include stats for, empty means all
    includeCategorizerStatuses: rt.array(categorizerStatusRT)
  })
});
exports.getLatestLogEntryCategoryDatasetsStatsRequestPayloadRT = getLatestLogEntryCategoryDatasetsStatsRequestPayloadRT;
/**
 * response
 */

const logEntryCategoriesDatasetStatsRT = rt.type({
  categorization_status: categorizerStatusRT,
  categorized_doc_count: rt.number,
  dataset: rt.string,
  dead_category_count: rt.number,
  failed_category_count: rt.number,
  frequent_category_count: rt.number,
  job_id: rt.string,
  log_time: rt.number,
  rare_category_count: rt.number,
  total_category_count: rt.number
});
const getLatestLogEntryCategoryDatasetsStatsSuccessResponsePayloadRT = rt.intersection([rt.type({
  data: rt.type({
    datasetStats: rt.array(logEntryCategoriesDatasetStatsRT)
  })
}), rt.partial({
  timing: _shared.routeTimingMetadataRT
})]);
exports.getLatestLogEntryCategoryDatasetsStatsSuccessResponsePayloadRT = getLatestLogEntryCategoryDatasetsStatsSuccessResponsePayloadRT;