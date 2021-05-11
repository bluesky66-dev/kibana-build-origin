"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockLevelLogger = createMockLevelLogger;

var _lib = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createMockLevelLogger() {
  // eslint-disable-next-line no-console
  const consoleLogger = tag => message => console.log(tag, message);

  const innerLogger = {
    get: () => innerLogger,
    debug: consoleLogger('debug'),
    info: consoleLogger('info'),
    warn: consoleLogger('warn'),
    trace: consoleLogger('trace'),
    error: consoleLogger('error'),
    fatal: consoleLogger('fatal'),
    log: consoleLogger('log')
  };
  return new _lib.LevelLogger(innerLogger);
}