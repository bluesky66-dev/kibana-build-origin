"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricsK8sAnomaliesRequestPayloadRT = exports.getMetricsK8sAnomaliesSuccessReponsePayloadRT = exports.INFA_ML_GET_METRICS_K8S_ANOMALIES_PATH = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _shared = require("../../shared");

var _common = require("./common");

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


const INFA_ML_GET_METRICS_K8S_ANOMALIES_PATH = '/api/infra/infra_ml/results/metrics_k8s_anomalies';
exports.INFA_ML_GET_METRICS_K8S_ANOMALIES_PATH = INFA_ML_GET_METRICS_K8S_ANOMALIES_PATH;
const metricsK8sAnomalyCommonFieldsRT = rt.type({
  id: rt.string,
  anomalyScore: rt.number,
  typical: rt.number,
  actual: rt.number,
  type: _common.anomalyTypeRT,
  influencers: rt.array(rt.string),
  duration: rt.number,
  startTime: rt.number,
  jobId: rt.string
});
const metricsK8sAnomalyRT = metricsK8sAnomalyCommonFieldsRT;
const getMetricsK8sAnomaliesSuccessReponsePayloadRT = rt.intersection([rt.type({
  data: rt.intersection([rt.type({
    anomalies: rt.array(metricsK8sAnomalyRT),
    // Signifies there are more entries backwards or forwards. If this was a request
    // for a previous page, there are more previous pages, if this was a request for a next page,
    // there are more next pages.
    hasMoreEntries: rt.boolean
  }), rt.partial({
    paginationCursors: rt.type({
      // The cursor to use to fetch the previous page
      previousPageCursor: _common.paginationCursorRT,
      // The cursor to use to fetch the next page
      nextPageCursor: _common.paginationCursorRT
    })
  })])
}), rt.partial({
  timing: _shared.routeTimingMetadataRT
})]);
exports.getMetricsK8sAnomaliesSuccessReponsePayloadRT = getMetricsK8sAnomaliesSuccessReponsePayloadRT;
const getMetricsK8sAnomaliesRequestPayloadRT = rt.type({
  data: rt.intersection([rt.type({
    // the ID of the source configuration
    sourceId: rt.string,
    anomalyThreshold: rt.number,
    // the time range to fetch the log entry anomalies from
    timeRange: _shared.timeRangeRT
  }), rt.partial({
    metric: _common.metricRT,
    // Pagination properties
    pagination: _common.paginationRT,
    // Sort properties
    sort: _common.sortRT,
    // Dataset filters
    datasets: rt.array(rt.string)
  })])
});
exports.getMetricsK8sAnomaliesRequestPayloadRT = getMetricsK8sAnomaliesRequestPayloadRT;