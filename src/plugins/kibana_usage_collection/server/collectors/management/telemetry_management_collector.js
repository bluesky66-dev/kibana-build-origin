"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCollectorFetch = createCollectorFetch;
exports.registerManagementUsageCollector = registerManagementUsageCollector;

var _schema = require("./schema");

var _constants = require("../../../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createCollectorFetch(getUiSettingsClient) {
  return async function fetchUsageStats() {
    const uiSettingsClient = getUiSettingsClient();

    if (!uiSettingsClient) {
      return;
    }

    const userProvided = await uiSettingsClient.getUserProvided();
    const modifiedEntries = Object.entries(userProvided).filter(([key]) => key !== 'buildNum').reduce((obj, [key, {
      userValue
    }]) => {
      const sensitive = uiSettingsClient.isSensitive(key);
      obj[key] = sensitive ? _constants.REDACTED_KEYWORD : userValue;
      return obj;
    }, {});
    return modifiedEntries;
  };
}

function registerManagementUsageCollector(usageCollection, getUiSettingsClient) {
  const collector = usageCollection.makeUsageCollector({
    type: 'stack_management',
    isReady: () => typeof getUiSettingsClient() !== 'undefined',
    fetch: createCollectorFetch(getUiSettingsClient),
    schema: _schema.stackManagementSchema
  });
  usageCollection.registerCollector(collector);
}