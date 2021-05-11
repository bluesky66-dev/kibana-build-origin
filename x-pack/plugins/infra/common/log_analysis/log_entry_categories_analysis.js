"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.categoriesSortRT = exports.logEntryCategoryRT = exports.logEntryCategoryHistogramRT = exports.logEntryCategoryHistogramBucketRT = exports.logEntryCategoryDatasetRT = exports.logEntryCategoriesJobTypes = exports.logEntryCategoriesJobTypeRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _log_analysis_results = require("./log_analysis_results");

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


const logEntryCategoriesJobTypeRT = rt.keyof({
  'log-entry-categories-count': null
});
exports.logEntryCategoriesJobTypeRT = logEntryCategoriesJobTypeRT;
const logEntryCategoriesJobTypes = ['log-entry-categories-count'];
exports.logEntryCategoriesJobTypes = logEntryCategoriesJobTypes;
const logEntryCategoryDatasetRT = rt.type({
  name: rt.string,
  maximumAnomalyScore: rt.number
});
exports.logEntryCategoryDatasetRT = logEntryCategoryDatasetRT;
const logEntryCategoryHistogramBucketRT = rt.type({
  startTime: rt.number,
  bucketDuration: rt.number,
  logEntryCount: rt.number
});
exports.logEntryCategoryHistogramBucketRT = logEntryCategoryHistogramBucketRT;
const logEntryCategoryHistogramRT = rt.type({
  histogramId: rt.string,
  buckets: rt.array(logEntryCategoryHistogramBucketRT)
});
exports.logEntryCategoryHistogramRT = logEntryCategoryHistogramRT;
const logEntryCategoryRT = rt.type({
  categoryId: rt.number,
  datasets: rt.array(logEntryCategoryDatasetRT),
  histograms: rt.array(logEntryCategoryHistogramRT),
  logEntryCount: rt.number,
  maximumAnomalyScore: rt.number,
  regularExpression: rt.string
});
exports.logEntryCategoryRT = logEntryCategoryRT;
const sortOptionsRT = rt.keyof({
  maximumAnomalyScore: null,
  logEntryCount: null
});
const categoriesSortRT = (0, _log_analysis_results.sortRT)(sortOptionsRT);
exports.categoriesSortRT = categoriesSortRT;