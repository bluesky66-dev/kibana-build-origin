"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Comparator", {
  enumerable: true,
  get: function () {
    return _types.Comparator;
  }
});
Object.defineProperty(exports, "AlertStates", {
  enumerable: true,
  get: function () {
    return _types.AlertStates;
  }
});
exports.Aggregators = exports.METRIC_THRESHOLD_ALERT_TYPE_ID = void 0;

var _types = require("../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const METRIC_THRESHOLD_ALERT_TYPE_ID = 'metrics.alert.threshold';
exports.METRIC_THRESHOLD_ALERT_TYPE_ID = METRIC_THRESHOLD_ALERT_TYPE_ID;
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