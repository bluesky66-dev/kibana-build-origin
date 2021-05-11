"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAlertTypes = void 0;

var _register_metric_threshold_alert_type = require("./metric_threshold/register_metric_threshold_alert_type");

var _register_inventory_metric_threshold_alert_type = require("./inventory_metric_threshold/register_inventory_metric_threshold_alert_type");

var _register_metric_anomaly_alert_type = require("./metric_anomaly/register_metric_anomaly_alert_type");

var _register_log_threshold_alert_type = require("./log_threshold/register_log_threshold_alert_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerAlertTypes = (alertingPlugin, libs, ml) => {
  if (alertingPlugin) {
    alertingPlugin.registerType((0, _register_metric_threshold_alert_type.registerMetricThresholdAlertType)(libs));
    alertingPlugin.registerType((0, _register_inventory_metric_threshold_alert_type.registerMetricInventoryThresholdAlertType)(libs));
    alertingPlugin.registerType((0, _register_metric_anomaly_alert_type.registerMetricAnomalyAlertType)(libs, ml));
    const registerFns = [_register_log_threshold_alert_type.registerLogThresholdAlertType];
    registerFns.forEach(fn => {
      fn(alertingPlugin, libs);
    });
  }
};

exports.registerAlertTypes = registerAlertTypes;