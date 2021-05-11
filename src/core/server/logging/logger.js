"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseLogger = void 0;

var _logging = require("@kbn/logging");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isError(x) {
  return x instanceof Error;
}
/** @internal */


class BaseLogger {
  constructor(context, level, appenders, factory) {
    this.context = context;
    this.level = level;
    this.appenders = appenders;
    this.factory = factory;
  }

  trace(message, meta) {
    this.log(this.createLogRecord(_logging.LogLevel.Trace, message, meta));
  }

  debug(message, meta) {
    this.log(this.createLogRecord(_logging.LogLevel.Debug, message, meta));
  }

  info(message, meta) {
    this.log(this.createLogRecord(_logging.LogLevel.Info, message, meta));
  }

  warn(errorOrMessage, meta) {
    this.log(this.createLogRecord(_logging.LogLevel.Warn, errorOrMessage, meta));
  }

  error(errorOrMessage, meta) {
    this.log(this.createLogRecord(_logging.LogLevel.Error, errorOrMessage, meta));
  }

  fatal(errorOrMessage, meta) {
    this.log(this.createLogRecord(_logging.LogLevel.Fatal, errorOrMessage, meta));
  }

  log(record) {
    if (!this.level.supports(record.level)) {
      return;
    }

    for (const appender of this.appenders) {
      appender.append(record);
    }
  }

  get(...childContextPaths) {
    return this.factory.get(...[this.context, ...childContextPaths]);
  }

  createLogRecord(level, errorOrMessage, meta) {
    if (isError(errorOrMessage)) {
      return {
        context: this.context,
        error: errorOrMessage,
        level,
        message: errorOrMessage.message,
        meta,
        timestamp: new Date(),
        pid: process.pid
      };
    }

    return {
      context: this.context,
      level,
      message: errorOrMessage,
      meta,
      timestamp: new Date(),
      pid: process.pid
    };
  }

}

exports.BaseLogger = BaseLogger;