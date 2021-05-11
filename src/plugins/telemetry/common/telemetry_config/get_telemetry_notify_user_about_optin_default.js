"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotifyUserAboutOptInDefault = getNotifyUserAboutOptInDefault;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getNotifyUserAboutOptInDefault({
  allowChangingOptInStatus,
  telemetrySavedObject,
  telemetryOptedIn,
  configTelemetryOptIn
}) {
  if (allowChangingOptInStatus === false) {
    return false;
  } // determine if notice has been seen before


  if (telemetrySavedObject && telemetrySavedObject.userHasSeenNotice === true) {
    return false;
  }

  return telemetryOptedIn === true && configTelemetryOptIn === true;
}