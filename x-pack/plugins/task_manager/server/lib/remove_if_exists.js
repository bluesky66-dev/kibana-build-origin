"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeIfExists = removeIfExists;

var _server = require("../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Removes a task from the store, ignoring a not found error
 * Other errors are re-thrown
 *
 * @param taskStore
 * @param taskId
 */


async function removeIfExists(taskStore, taskId) {
  try {
    await taskStore.remove(taskId);
  } catch (err) {
    if (!_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
      throw err;
    }
  }
}