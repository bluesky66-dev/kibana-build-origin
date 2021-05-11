"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertStates = exports.Aggregators = exports.Comparator = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

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

let AlertStates;
exports.AlertStates = AlertStates;

(function (AlertStates) {
  AlertStates[AlertStates["OK"] = 0] = "OK";
  AlertStates[AlertStates["ALERT"] = 1] = "ALERT";
  AlertStates[AlertStates["WARNING"] = 2] = "WARNING";
  AlertStates[AlertStates["NO_DATA"] = 3] = "NO_DATA";
  AlertStates[AlertStates["ERROR"] = 4] = "ERROR";
})(AlertStates || (exports.AlertStates = AlertStates = {}));