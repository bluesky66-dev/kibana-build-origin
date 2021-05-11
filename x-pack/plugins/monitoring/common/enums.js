"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetupModeFeature = exports.AlertParamType = exports.AlertMessageTokenType = exports.AlertSeverity = exports.AlertClusterHealthType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let AlertClusterHealthType;
exports.AlertClusterHealthType = AlertClusterHealthType;

(function (AlertClusterHealthType) {
  AlertClusterHealthType["Green"] = "green";
  AlertClusterHealthType["Red"] = "red";
  AlertClusterHealthType["Yellow"] = "yellow";
})(AlertClusterHealthType || (exports.AlertClusterHealthType = AlertClusterHealthType = {}));

let AlertSeverity;
exports.AlertSeverity = AlertSeverity;

(function (AlertSeverity) {
  AlertSeverity["Success"] = "success";
  AlertSeverity["Danger"] = "danger";
  AlertSeverity["Warning"] = "warning";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));

let AlertMessageTokenType;
exports.AlertMessageTokenType = AlertMessageTokenType;

(function (AlertMessageTokenType) {
  AlertMessageTokenType["Time"] = "time";
  AlertMessageTokenType["Link"] = "link";
  AlertMessageTokenType["DocLink"] = "docLink";
})(AlertMessageTokenType || (exports.AlertMessageTokenType = AlertMessageTokenType = {}));

let AlertParamType;
exports.AlertParamType = AlertParamType;

(function (AlertParamType) {
  AlertParamType["TextField"] = "textfield";
  AlertParamType["Duration"] = "duration";
  AlertParamType["Percentage"] = "percentage";
  AlertParamType["Number"] = "number";
})(AlertParamType || (exports.AlertParamType = AlertParamType = {}));

let SetupModeFeature;
exports.SetupModeFeature = SetupModeFeature;

(function (SetupModeFeature) {
  SetupModeFeature["MetricbeatMigration"] = "metricbeatMigration";
  SetupModeFeature["Alerts"] = "alerts";
})(SetupModeFeature || (exports.SetupModeFeature = SetupModeFeature = {}));