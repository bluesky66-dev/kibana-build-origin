"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMlAlerts = registerMlAlerts;

var _register_anomaly_detection_alert_type = require("./register_anomaly_detection_alert_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerMlAlerts(params) {
  (0, _register_anomaly_detection_alert_type.registerAnomalyDetectionAlertType)(params);
}