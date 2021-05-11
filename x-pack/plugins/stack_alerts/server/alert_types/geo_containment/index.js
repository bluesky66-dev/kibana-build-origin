"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;

var _alert_type = require("./alert_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function register(params) {
  const {
    logger,
    alerts
  } = params;
  alerts.registerType((0, _alert_type.getAlertType)(logger));
}