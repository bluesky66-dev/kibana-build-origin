"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerConversion = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const LoggerConversion = {
  pattern: /%logger/g,

  convert(record, highlight) {
    let message = record.context;

    if (highlight) {
      message = _chalk.default.magenta(message);
    }

    return message;
  }

};
exports.LoggerConversion = LoggerConversion;