"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerAdapter = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class LoggerAdapter {
  constructor(logger) {
    this.logger = logger;
  }
  /**
   * The current logger can be updated "on the fly", e.g. when the log config
   * has changed.
   *
   * This is not intended for external use, only internally in Kibana
   *
   * @internal
   */


  updateLogger(logger) {
    this.logger = logger;
  }

  trace(message, meta) {
    this.logger.trace(message, meta);
  }

  debug(message, meta) {
    this.logger.debug(message, meta);
  }

  info(message, meta) {
    this.logger.info(message, meta);
  }

  warn(errorOrMessage, meta) {
    this.logger.warn(errorOrMessage, meta);
  }

  error(errorOrMessage, meta) {
    this.logger.error(errorOrMessage, meta);
  }

  fatal(errorOrMessage, meta) {
    this.logger.fatal(errorOrMessage, meta);
  }

  log(record) {
    this.logger.log(record);
  }

  get(...contextParts) {
    return this.logger.get(...contextParts);
  }

}

exports.LoggerAdapter = LoggerAdapter;