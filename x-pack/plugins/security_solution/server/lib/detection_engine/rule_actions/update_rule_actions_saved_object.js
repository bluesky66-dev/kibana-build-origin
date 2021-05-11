"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRuleActionsSavedObject = void 0;

var _saved_object_mappings = require("./saved_object_mappings");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateRuleActionsSavedObject = async ({
  ruleAlertId,
  savedObjectsClient,
  actions,
  throttle,
  ruleActions
}) => {
  const throttleOptions = throttle ? (0, _utils.getThrottleOptions)(throttle) : {
    ruleThrottle: ruleActions.ruleThrottle,
    alertThrottle: ruleActions.alertThrottle
  };
  const options = {
    actions: actions !== null && actions !== void 0 ? actions : ruleActions.actions,
    ...throttleOptions
  };
  await savedObjectsClient.update(_saved_object_mappings.ruleActionsSavedObjectType, ruleActions.id, {
    ruleAlertId,
    ...options
  });
  return {
    id: ruleActions.id,
    ...options
  };
};

exports.updateRuleActionsSavedObject = updateRuleActionsSavedObject;