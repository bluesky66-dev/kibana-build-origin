"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrCreateRuleStatuses = exports.createNewRuleStatus = void 0;

var _get_rule_status_saved_objects = require("./get_rule_status_saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createNewRuleStatus = async ({
  alertId,
  ruleStatusClient
}) => {
  const now = new Date().toISOString();
  return ruleStatusClient.create({
    alertId,
    statusDate: now,
    status: 'going to run',
    lastFailureAt: null,
    lastSuccessAt: null,
    lastFailureMessage: null,
    lastSuccessMessage: null,
    gap: null,
    bulkCreateTimeDurations: [],
    searchAfterTimeDurations: [],
    lastLookBackDate: null
  });
};

exports.createNewRuleStatus = createNewRuleStatus;

const getOrCreateRuleStatuses = async ({
  alertId,
  ruleStatusClient
}) => {
  const ruleStatuses = await (0, _get_rule_status_saved_objects.getRuleStatusSavedObjects)({
    alertId,
    ruleStatusClient
  });

  if (ruleStatuses.saved_objects.length > 0) {
    return ruleStatuses.saved_objects;
  }

  const newStatus = await createNewRuleStatus({
    alertId,
    ruleStatusClient
  });
  return [newStatus];
};

exports.getOrCreateRuleStatuses = getOrCreateRuleStatuses;