"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerApmAlerts = registerApmAlerts;

var _register_transaction_duration_alert_type = require("./register_transaction_duration_alert_type");

var _register_transaction_duration_anomaly_alert_type = require("./register_transaction_duration_anomaly_alert_type");

var _register_error_count_alert_type = require("./register_error_count_alert_type");

var _register_transaction_error_rate_alert_type = require("./register_transaction_error_rate_alert_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerApmAlerts(params) {
  (0, _register_transaction_duration_alert_type.registerTransactionDurationAlertType)({
    alerts: params.alerts,
    config$: params.config$
  });
  (0, _register_transaction_duration_anomaly_alert_type.registerTransactionDurationAnomalyAlertType)({
    alerts: params.alerts,
    ml: params.ml,
    config$: params.config$
  });
  (0, _register_error_count_alert_type.registerErrorCountAlertType)({
    alerts: params.alerts,
    config$: params.config$
  });
  (0, _register_transaction_error_rate_alert_type.registerTransactionErrorRateAlertType)({
    alerts: params.alerts,
    config$: params.config$
  });
}