"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;
exports.DEFAULT_GROUPS = exports.MAX_GROUPS = exports.MAX_INTERVALS = void 0;

var _alert_type = require("./alert_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// future enhancement: make these configurable?


const MAX_INTERVALS = 1000;
exports.MAX_INTERVALS = MAX_INTERVALS;
const MAX_GROUPS = 1000;
exports.MAX_GROUPS = MAX_GROUPS;
const DEFAULT_GROUPS = 100;
exports.DEFAULT_GROUPS = DEFAULT_GROUPS;

function register(params) {
  const {
    logger,
    data,
    alerts
  } = params;
  alerts.registerType((0, _alert_type.getAlertType)(logger, data));
}