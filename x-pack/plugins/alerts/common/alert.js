"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HealthStatus = exports.AlertExecutionStatusErrorReasons = exports.AlertExecutionStatusValues = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// for the `typeof ThingValues[number]` types below, become string types that
// only accept the values in the associated string arrays

const AlertExecutionStatusValues = ['ok', 'active', 'error', 'pending', 'unknown'];
exports.AlertExecutionStatusValues = AlertExecutionStatusValues;
let AlertExecutionStatusErrorReasons;
exports.AlertExecutionStatusErrorReasons = AlertExecutionStatusErrorReasons;

(function (AlertExecutionStatusErrorReasons) {
  AlertExecutionStatusErrorReasons["Read"] = "read";
  AlertExecutionStatusErrorReasons["Decrypt"] = "decrypt";
  AlertExecutionStatusErrorReasons["Execute"] = "execute";
  AlertExecutionStatusErrorReasons["Unknown"] = "unknown";
  AlertExecutionStatusErrorReasons["License"] = "license";
})(AlertExecutionStatusErrorReasons || (exports.AlertExecutionStatusErrorReasons = AlertExecutionStatusErrorReasons = {}));

let HealthStatus;
exports.HealthStatus = HealthStatus;

(function (HealthStatus) {
  HealthStatus["OK"] = "ok";
  HealthStatus["Warning"] = "warn";
  HealthStatus["Error"] = "error";
})(HealthStatus || (exports.HealthStatus = HealthStatus = {}));