"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertPreviewSuccessResponsePayloadRT = exports.alertPreviewRequestParamsRT = exports.Aggregators = exports.Comparator = exports.METRIC_ANOMALY_ALERT_TYPE_ID = exports.METRIC_INVENTORY_THRESHOLD_ALERT_TYPE_ID = exports.METRIC_THRESHOLD_ALERT_TYPE_ID = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _types = require("../../inventory_models/types");

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
// TODO: Have threshold and inventory alerts import these types from this file instead of from their
// local directories


const METRIC_THRESHOLD_ALERT_TYPE_ID = 'metrics.alert.threshold';
exports.METRIC_THRESHOLD_ALERT_TYPE_ID = METRIC_THRESHOLD_ALERT_TYPE_ID;
const METRIC_INVENTORY_THRESHOLD_ALERT_TYPE_ID = 'metrics.alert.inventory.threshold';
exports.METRIC_INVENTORY_THRESHOLD_ALERT_TYPE_ID = METRIC_INVENTORY_THRESHOLD_ALERT_TYPE_ID;
const METRIC_ANOMALY_ALERT_TYPE_ID = 'metrics.alert.anomaly';
exports.METRIC_ANOMALY_ALERT_TYPE_ID = METRIC_ANOMALY_ALERT_TYPE_ID;
let Comparator;
exports.Comparator = Comparator;

(function (Comparator) {
  Comparator["GT"] = ">";
  Comparator["LT"] = "<";
  Comparator["GT_OR_EQ"] = ">=";
  Comparator["LT_OR_EQ"] = "<=";
  Comparator["BETWEEN"] = "between";
  Comparator["OUTSIDE_RANGE"] = "outside";
})(Comparator || (exports.Comparator = Comparator = {}));

let Aggregators;
exports.Aggregators = Aggregators;

(function (Aggregators) {
  Aggregators["COUNT"] = "count";
  Aggregators["AVERAGE"] = "avg";
  Aggregators["SUM"] = "sum";
  Aggregators["MIN"] = "min";
  Aggregators["MAX"] = "max";
  Aggregators["RATE"] = "rate";
  Aggregators["CARDINALITY"] = "cardinality";
  Aggregators["P95"] = "p95";
  Aggregators["P99"] = "p99";
})(Aggregators || (exports.Aggregators = Aggregators = {}));

const metricAnomalyNodeTypeRT = rt.union([rt.literal('hosts'), rt.literal('k8s')]);
const metricAnomalyMetricRT = rt.union([rt.literal('memory_usage'), rt.literal('network_in'), rt.literal('network_out')]);
const metricAnomalyInfluencerFilterRT = rt.type({
  fieldName: rt.string,
  fieldValue: rt.string
}); // Alert Preview API

const baseAlertRequestParamsRT = rt.intersection([rt.partial({
  filterQuery: rt.union([rt.string, rt.undefined]),
  sourceId: rt.string
}), rt.type({
  lookback: rt.union([rt.literal('ms'), rt.literal('s'), rt.literal('m'), rt.literal('h'), rt.literal('d'), rt.literal('w'), rt.literal('M'), rt.literal('y')]),
  alertInterval: rt.string,
  alertThrottle: rt.string,
  alertOnNoData: rt.boolean,
  alertNotifyWhen: rt.string
})]);
const metricThresholdAlertPreviewRequestParamsRT = rt.intersection([baseAlertRequestParamsRT, rt.partial({
  groupBy: rt.union([rt.string, rt.array(rt.string), rt.undefined])
}), rt.type({
  alertType: rt.literal(METRIC_THRESHOLD_ALERT_TYPE_ID),
  criteria: rt.array(rt.any)
})]);
const inventoryAlertPreviewRequestParamsRT = rt.intersection([baseAlertRequestParamsRT, rt.type({
  nodeType: _types.ItemTypeRT,
  alertType: rt.literal(METRIC_INVENTORY_THRESHOLD_ALERT_TYPE_ID),
  criteria: rt.array(rt.any)
})]);
const metricAnomalyAlertPreviewRequestParamsRT = rt.intersection([baseAlertRequestParamsRT, rt.type({
  nodeType: metricAnomalyNodeTypeRT,
  metric: metricAnomalyMetricRT,
  threshold: rt.number,
  alertType: rt.literal(METRIC_ANOMALY_ALERT_TYPE_ID),
  spaceId: rt.string
}), rt.partial({
  influencerFilter: metricAnomalyInfluencerFilterRT
})]);
const alertPreviewRequestParamsRT = rt.union([metricThresholdAlertPreviewRequestParamsRT, inventoryAlertPreviewRequestParamsRT, metricAnomalyAlertPreviewRequestParamsRT]);
exports.alertPreviewRequestParamsRT = alertPreviewRequestParamsRT;
const alertPreviewSuccessResponsePayloadRT = rt.type({
  numberOfGroups: rt.number,
  resultTotals: rt.intersection([rt.type({
    fired: rt.number,
    noData: rt.number,
    error: rt.number,
    notifications: rt.number
  }), rt.partial({
    warning: rt.number
  })])
});
exports.alertPreviewSuccessResponsePayloadRT = alertPreviewSuccessResponsePayloadRT;