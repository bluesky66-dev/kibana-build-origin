"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRulesNotifications = void 0;

var _update_or_create_rule_actions_saved_object = require("../rule_actions/update_or_create_rule_actions_saved_object");

var _update_notifications = require("../notifications/update_notifications");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateRulesNotifications = async ({
  alertsClient,
  savedObjectsClient,
  ruleAlertId,
  actions,
  enabled,
  name,
  throttle
}) => {
  const ruleActions = await (0, _update_or_create_rule_actions_saved_object.updateOrCreateRuleActionsSavedObject)({
    savedObjectsClient,
    ruleAlertId,
    actions,
    throttle
  });
  await (0, _update_notifications.updateNotifications)({
    alertsClient,
    ruleAlertId,
    enabled,
    name,
    actions: ruleActions.actions,
    interval: ruleActions.alertThrottle
  });
  return ruleActions;
};

exports.updateRulesNotifications = updateRulesNotifications;