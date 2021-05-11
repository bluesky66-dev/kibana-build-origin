"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MigrationLogger = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * This file provides a helper class for ensuring that all logging
 * in the migration system is done in a fairly uniform way.
 */

/** @public */
class MigrationLogger {
  constructor(log) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "info", msg => this.logger.info(msg));

    _defineProperty(this, "debug", msg => this.logger.debug(msg));

    _defineProperty(this, "warning", msg => this.logger.warn(msg));

    _defineProperty(this, "warn", msg => this.logger.warn(msg));

    _defineProperty(this, "error", (msg, meta) => this.logger.error(msg, meta));

    this.logger = log;
  }

}

exports.MigrationLogger = MigrationLogger;