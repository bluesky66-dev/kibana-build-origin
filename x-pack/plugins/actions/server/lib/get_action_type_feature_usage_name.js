"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionTypeFeatureUsageName = getActionTypeFeatureUsageName;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getActionTypeFeatureUsageName(actionType) {
  return `Connector: ${actionType.name}`;
}