"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateOrCreateRuleActionsSavedObject = void 0;

var _get_rule_actions_saved_object = require("./get_rule_actions_saved_object");

var _create_rule_actions_saved_object = require("./create_rule_actions_saved_object");

var _update_rule_actions_saved_object = require("./update_rule_actions_saved_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateOrCreateRuleActionsSavedObject = async ({
  savedObjectsClient,
  ruleAlertId,
  actions,
  throttle
}) => {
  const ruleActions = await (0, _get_rule_actions_saved_object.getRuleActionsSavedObject)({
    ruleAlertId,
    savedObjectsClient
  });

  if (ruleActions != null) {
    return (0, _update_rule_actions_saved_object.updateRuleActionsSavedObject)({
      ruleAlertId,
      savedObjectsClient,
      actions,
      throttle,
      ruleActions
    });
  } else {
    return (0, _create_rule_actions_saved_object.createRuleActionsSavedObject)({
      ruleAlertId,
      savedObjectsClient,
      actions,
      throttle
    });
  }
};

exports.updateOrCreateRuleActionsSavedObject = updateOrCreateRuleActionsSavedObject;