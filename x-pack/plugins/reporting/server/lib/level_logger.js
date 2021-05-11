"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LevelLogger = void 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const trimStr = toTrim => {
  return typeof toTrim === 'string' ? toTrim.trim() : toTrim;
};

class LevelLogger {
  constructor(logger, tags) {
    _defineProperty(this, "_logger", void 0);

    _defineProperty(this, "_tags", void 0);

    _defineProperty(this, "warning", void 0);

    this._logger = logger;
    this._tags = tags || [];
    /*
     * This shortcut provides maintenance convenience: Reporting code has been
     * using both .warn and .warning
     */

    this.warning = this.warn.bind(this);
  }

  getLogger(tags) {
    return this._logger.get(...this._tags, ...tags);
  }

  error(err, tags = []) {
    this.getLogger(tags).error(err);
  }

  warn(msg, tags = []) {
    this.getLogger(tags).warn(msg);
  }

  debug(msg, tags = []) {
    this.getLogger(tags).debug(msg);
  }

  trace(msg, tags = []) {
    this.getLogger(tags).trace(msg);
  }

  info(msg, tags = []) {
    this.getLogger(tags).info(trimStr(msg));
  }

  clone(tags) {
    return new LevelLogger(this._logger, [...this._tags, ...tags]);
  }

}

exports.LevelLogger = LevelLogger;