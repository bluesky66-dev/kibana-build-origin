"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockLogger = mockLogger;
exports.resolvable = resolvable;
exports.sleep = sleep;

var _mocks = require("src/core/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * A handful of helper functions for testing the task manager.
 */
// Caching this here to avoid setTimeout mocking affecting our tests.


const nativeTimeout = setTimeout;

function mockLogger() {
  return _mocks.loggingSystemMock.createLogger();
}
/**
 * Creates a promise which can be resolved externally, useful for
 * coordinating async tests.
 */


function resolvable() {
  let resolve;
  return Object.assign(new Promise(r => resolve = r), {
    resolve() {
      return nativeTimeout(resolve, 0);
    }

  });
}
/**
 * A simple helper for waiting a specified number of milliseconds.
 *
 * @param {number} ms
 */


async function sleep(ms) {
  return new Promise(r => nativeTimeout(r, ms));
}