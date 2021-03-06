"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleOldSettings = handleOldSettings;

var _constants = require("../../common/constants");

var _telemetry_repository = require("../telemetry_repository");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Clean up any old, deprecated settings and determine if we should continue.
 *
 * This <em>will</em> update the latest telemetry setting if necessary.
 *
 * @param {Object} config The advanced settings config object.
 * @return {Boolean} {@code true} if the banner should still be displayed. {@code false} if the banner should not be displayed.
 */
const CONFIG_ALLOW_REPORT = 'xPackMonitoring:allowReport';

async function handleOldSettings(savedObjectsClient, uiSettingsClient) {
  const oldTelemetrySetting = await uiSettingsClient.get(_constants.CONFIG_TELEMETRY);
  const oldAllowReportSetting = await uiSettingsClient.get(CONFIG_ALLOW_REPORT);
  let legacyOptInValue = null;

  if (typeof oldTelemetrySetting === 'boolean') {
    legacyOptInValue = oldTelemetrySetting;
  } else if (typeof oldAllowReportSetting === 'boolean' && uiSettingsClient.isOverridden(CONFIG_ALLOW_REPORT)) {
    legacyOptInValue = oldAllowReportSetting;
  }

  if (legacyOptInValue !== null) {
    await (0, _telemetry_repository.updateTelemetrySavedObject)(savedObjectsClient, {
      enabled: legacyOptInValue
    });
  }
}