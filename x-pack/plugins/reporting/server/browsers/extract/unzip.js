"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unzip = unzip;

var _extractZip = _interopRequireDefault(require("extract-zip"));

var _extract_error = require("./extract_error");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function unzip(filepath, target) {
  try {
    await (0, _extractZip.default)(filepath, {
      dir: target
    });
  } catch (err) {
    throw new _extract_error.ExtractError(err);
  }
}