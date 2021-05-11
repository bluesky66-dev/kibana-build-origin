"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAlertSavedObjectNotFoundError = isAlertSavedObjectNotFoundError;

var _server = require("../../../../../src/core/server");

var _error_with_reason = require("./error_with_reason");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isAlertSavedObjectNotFoundError(err, alertId) {
  // if this is an error with a reason, the actual error needs to be extracted
  const actualError = (0, _error_with_reason.isErrorWithReason)(err) ? err.error : err;
  return _server.SavedObjectsErrorHelpers.isNotFoundError(actualError) && `${actualError}`.includes(alertId);
}