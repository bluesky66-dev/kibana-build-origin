"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleStatusSavedObjects = void 0;

var _rule_status_service = require("./rule_status_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getRuleStatusSavedObjects = async ({
  alertId,
  ruleStatusClient
}) => {
  return ruleStatusClient.find({
    perPage: _rule_status_service.MAX_RULE_STATUSES,
    sortField: 'statusDate',
    sortOrder: 'desc',
    search: `${alertId}`,
    searchFields: ['alertId']
  });
};

exports.getRuleStatusSavedObjects = getRuleStatusSavedObjects;