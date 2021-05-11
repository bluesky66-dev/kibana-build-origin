"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogAlertsChartPreviewDataRequestPayloadRT = exports.getLogAlertsChartPreviewDataAlertParamsSubsetRT = exports.getLogAlertsChartPreviewDataSuccessResponsePayloadRT = exports.LOG_ALERTS_CHART_PREVIEW_DATA_PATH = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _types = require("../../alerting/logs/log_threshold/types");

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


const LOG_ALERTS_CHART_PREVIEW_DATA_PATH = '/api/infra/log_alerts/chart_preview_data';
exports.LOG_ALERTS_CHART_PREVIEW_DATA_PATH = LOG_ALERTS_CHART_PREVIEW_DATA_PATH;
const pointRT = rt.type({
  timestamp: rt.number,
  value: rt.number
});
const serieRT = rt.type({
  id: rt.string,
  points: rt.array(pointRT)
});
const seriesRT = rt.array(serieRT);
const getLogAlertsChartPreviewDataSuccessResponsePayloadRT = rt.type({
  data: rt.type({
    series: seriesRT
  })
});
exports.getLogAlertsChartPreviewDataSuccessResponsePayloadRT = getLogAlertsChartPreviewDataSuccessResponsePayloadRT; // This should not have an explicit `any` return type, but it's here because its
// inferred type includes `Comparator` which is a string enum exported from
// common/alerting/logs/log_threshold/types.ts.
//
// There's a bug that's fixed in TypeScript 4.2.0 that will allow us to remove
// the `:any` from this, so remove it when that update happens.
//
// If it's removed before then you get:
//
//     x-pack/plugins/infra/common/http_api/log_alerts/chart_preview_data.ts:44:14 - error TS4023:
//     Exported variable 'getLogAlertsChartPreviewDataAlertParamsSubsetRT' has or is using name 'Comparator'
//     from external module "/Users/smith/Code/kibana/x-pack/plugins/infra/common/alerting/logs/log_threshold/types"
//     but cannot be named.
//

const getLogAlertsChartPreviewDataAlertParamsSubsetRT = rt.intersection([rt.type({
  criteria: _types.countCriteriaRT,
  timeUnit: _types.timeUnitRT,
  timeSize: _types.timeSizeRT
}), rt.partial({
  groupBy: _types.groupByRT
})]);
exports.getLogAlertsChartPreviewDataAlertParamsSubsetRT = getLogAlertsChartPreviewDataAlertParamsSubsetRT;
const getLogAlertsChartPreviewDataRequestPayloadRT = rt.type({
  data: rt.type({
    sourceId: rt.string,
    alertParams: getLogAlertsChartPreviewDataAlertParamsSubsetRT,
    buckets: rt.number
  })
});
exports.getLogAlertsChartPreviewDataRequestPayloadRT = getLogAlertsChartPreviewDataRequestPayloadRT;