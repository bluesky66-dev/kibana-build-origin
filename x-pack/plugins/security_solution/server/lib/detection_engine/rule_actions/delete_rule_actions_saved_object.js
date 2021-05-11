"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteRuleActionsSavedObject = void 0;

var _saved_object_mappings = require("./saved_object_mappings");

var _get_rule_actions_saved_object = require("./get_rule_actions_saved_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteRuleActionsSavedObject = async ({
  ruleAlertId,
  savedObjectsClient
}) => {
  const ruleActions = await (0, _get_rule_actions_saved_object.getRuleActionsSavedObject)({
    ruleAlertId,
    savedObjectsClient
  });

  if (ruleActions != null) {
    return savedObjectsClient.delete(_saved_object_mappings.ruleActionsSavedObjectType, ruleActions.id);
  } else {
    return null;
  }
};

exports.deleteRuleActionsSavedObject = deleteRuleActionsSavedObject;