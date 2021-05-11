"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTelemetryAllowChangingOptInStatus = getTelemetryAllowChangingOptInStatus;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getTelemetryAllowChangingOptInStatus({
  telemetrySavedObject,
  configTelemetryAllowChangingOptInStatus
}) {
  if (!telemetrySavedObject) {
    return configTelemetryAllowChangingOptInStatus;
  }

  if (typeof telemetrySavedObject.allowChangingOptInStatus === 'undefined') {
    return configTelemetryAllowChangingOptInStatus;
  }

  return telemetrySavedObject.allowChangingOptInStatus;
}