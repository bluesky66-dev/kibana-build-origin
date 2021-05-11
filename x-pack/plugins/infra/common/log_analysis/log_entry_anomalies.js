"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anomaliesSortRT = exports.isCategoryAnomaly = exports.logEntryAnomalyDatasetsRT = exports.logEntryAnomalyRT = exports.logEntrylogCategoryAnomalyRT = exports.logEntrylogRateAnomalyRT = exports.logEntryAnomalyCommonFieldsRT = exports.anomalyTypeRT = void 0;

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


const anomalyTypeRT = rt.keyof({
  logRate: null,
  logCategory: null
});
exports.anomalyTypeRT = anomalyTypeRT;
const logEntryAnomalyCommonFieldsRT = rt.type({
  id: rt.string,
  anomalyScore: rt.number,
  dataset: rt.string,
  typical: rt.number,
  actual: rt.number,
  type: anomalyTypeRT,
  duration: rt.number,
  startTime: rt.number,
  jobId: rt.string
});
exports.logEntryAnomalyCommonFieldsRT = logEntryAnomalyCommonFieldsRT;
const logEntrylogRateAnomalyRT = logEntryAnomalyCommonFieldsRT;
exports.logEntrylogRateAnomalyRT = logEntrylogRateAnomalyRT;
const logEntrylogCategoryAnomalyRT = rt.intersection([logEntryAnomalyCommonFieldsRT, rt.type({
  categoryId: rt.string,
  categoryRegex: rt.string,
  categoryTerms: rt.string
})]);
exports.logEntrylogCategoryAnomalyRT = logEntrylogCategoryAnomalyRT;
const logEntryAnomalyRT = rt.union([logEntrylogRateAnomalyRT, logEntrylogCategoryAnomalyRT]);
exports.logEntryAnomalyRT = logEntryAnomalyRT;
const logEntryAnomalyDatasetsRT = rt.array(rt.string);
exports.logEntryAnomalyDatasetsRT = logEntryAnomalyDatasetsRT;

const isCategoryAnomaly = anomaly => {
  return anomaly.type === 'logCategory';
};

exports.isCategoryAnomaly = isCategoryAnomaly;
const sortOptionsRT = rt.keyof({
  anomalyScore: null,
  dataset: null,
  startTime: null
});
const anomaliesSortRT = (0, _log_analysis_results.sortRT)(sortOptionsRT);
exports.anomaliesSortRT = anomaliesSortRT;