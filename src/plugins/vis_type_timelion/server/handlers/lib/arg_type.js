"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = argType;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function argType(arg) {
  if (Array.isArray(arg)) {
    return _lodash.default.chain(arg).map(argType).flattenDeep().value();
  }

  if (_lodash.default.isObject(arg) && arg) {
    return arg.type;
  }

  if (arg == null) {
    return 'null';
  }

  return typeof arg;
}

module.exports = exports.default;