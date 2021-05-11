"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNotificationAlertExecutor = exports.isAlertType = exports.isAlertTypes = void 0;

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isAlertTypes = partialAlert => {
  return partialAlert.every(rule => isAlertType(rule));
};

exports.isAlertTypes = isAlertTypes;

const isAlertType = partialAlert => {
  return partialAlert.alertTypeId === _constants.NOTIFICATIONS_ID;
};

exports.isAlertType = isAlertType; // This returns true because by default a NotificationAlertTypeDefinition is an AlertType
// since we are only increasing the strictness of params.

const isNotificationAlertExecutor = obj => {
  return true;
};

exports.isNotificationAlertExecutor = isNotificationAlertExecutor;