"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LevelConversion = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _logging = require("@kbn/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const LEVEL_COLORS = new Map([[_logging.LogLevel.Fatal, _chalk.default.red], [_logging.LogLevel.Error, _chalk.default.red], [_logging.LogLevel.Warn, _chalk.default.yellow], [_logging.LogLevel.Debug, _chalk.default.green], [_logging.LogLevel.Trace, _chalk.default.blue]]);
const LevelConversion = {
  pattern: /%level/g,

  convert(record, highlight) {
    let message = record.level.id.toUpperCase().padEnd(5);

    if (highlight && LEVEL_COLORS.has(record.level)) {
      const color = LEVEL_COLORS.get(record.level);
      message = color(message);
    }

    return message;
  }

};
exports.LevelConversion = LevelConversion;