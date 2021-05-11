"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMlServerLog = initMlServerLog;
exports.mlLog = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let mlLog;
exports.mlLog = mlLog;

function initMlServerLog(logInitialization) {
  exports.mlLog = mlLog = {
    fatal: message => logInitialization.log.fatal(message),
    error: message => logInitialization.log.error(message),
    warn: message => logInitialization.log.warn(message),
    info: message => logInitialization.log.info(message),
    debug: message => logInitialization.log.debug(message),
    trace: message => logInitialization.log.trace(message)
  };
}