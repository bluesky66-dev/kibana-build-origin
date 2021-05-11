"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTaskSavedObjectNotFoundError = isTaskSavedObjectNotFoundError;

var _server = require("../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isTaskSavedObjectNotFoundError(err, taskId) {
  return _server.SavedObjectsErrorHelpers.isNotFoundError(err) && `${err}`.includes(taskId);
}