"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleActionsSavedObject = void 0;

var _saved_object_mappings = require("./saved_object_mappings");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createRuleActionsSavedObject = async ({
  ruleAlertId,
  savedObjectsClient,
  actions = [],
  throttle
}) => {
  const ruleActionsSavedObject = await savedObjectsClient.create(_saved_object_mappings.ruleActionsSavedObjectType, {
    ruleAlertId,
    actions,
    ...(0, _utils.getThrottleOptions)(throttle)
  });
  return (0, _utils.getRuleActionsFromSavedObject)(ruleActionsSavedObject);
};

exports.createRuleActionsSavedObject = createRuleActionsSavedObject;