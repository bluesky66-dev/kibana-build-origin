"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scheduleNotificationActions = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const scheduleNotificationActions = ({
  alertInstance,
  signalsCount,
  resultsLink = '',
  ruleParams,
  signals
}) => alertInstance.replaceState({
  signals_count: signalsCount
}).scheduleActions('default', {
  results_link: resultsLink,
  rule: (0, _fp.mapKeys)(_fp.snakeCase, ruleParams),
  alerts: signals
});

exports.scheduleNotificationActions = scheduleNotificationActions;