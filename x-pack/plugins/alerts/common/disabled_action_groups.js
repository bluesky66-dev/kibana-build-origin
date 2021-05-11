"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isActionGroupDisabledForActionTypeId = isActionGroupDisabledForActionTypeId;
exports.DisabledActionTypeIdsForActionGroup = void 0;

var _builtin_action_groups = require("./builtin_action_groups");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DisabledActionGroupsByActionType = {
  [_builtin_action_groups.RecoveredActionGroup.id]: ['.jira', '.servicenow', '.resilient']
};
const DisabledActionTypeIdsForActionGroup = new Map(Object.entries(DisabledActionGroupsByActionType));
exports.DisabledActionTypeIdsForActionGroup = DisabledActionTypeIdsForActionGroup;

function isActionGroupDisabledForActionTypeId(actionGroup, actionTypeId) {
  return DisabledActionTypeIdsForActionGroup.has(actionGroup) && DisabledActionTypeIdsForActionGroup.get(actionGroup).includes(actionTypeId);
}