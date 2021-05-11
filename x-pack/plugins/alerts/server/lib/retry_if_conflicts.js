"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retryIfConflicts = retryIfConflicts;
exports.RetryForConflictsAttempts = void 0;

var _server = require("../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// This module provides a helper to perform retries on a function if the
// function ends up throwing a SavedObject 409 conflict.  This can happen
// when alert SO's are updated in the background, and will avoid having to
// have the caller make explicit conflict checks, where the conflict was
// caused by a background update.
// number of times to retry when conflicts occur


const RetryForConflictsAttempts = 2; // milliseconds to wait before retrying when conflicts occur
// note: we considered making this random, to help avoid a stampede, but
// with 1 retry it probably doesn't matter, and adding randomness could
// make it harder to diagnose issues

exports.RetryForConflictsAttempts = RetryForConflictsAttempts;
const RetryForConflictsDelay = 250; // retry an operation if it runs into 409 Conflict's, up to a limit

async function retryIfConflicts(logger, name, operation, retries = RetryForConflictsAttempts) {
  // run the operation, return if no errors or throw if not a conflict error
  try {
    return await operation();
  } catch (err) {
    if (!_server.SavedObjectsErrorHelpers.isConflictError(err)) {
      throw err;
    } // must be a conflict; if no retries left, throw it


    if (retries <= 0) {
      logger.warn(`${name} conflict, exceeded retries`);
      throw err;
    } // delay a bit before retrying


    logger.debug(`${name} conflict, retrying ...`);
    await waitBeforeNextRetry();
    return await retryIfConflicts(logger, name, operation, retries - 1);
  }
}

async function waitBeforeNextRetry() {
  await new Promise(resolve => setTimeout(resolve, RetryForConflictsDelay));
}