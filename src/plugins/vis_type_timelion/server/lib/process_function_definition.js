"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function _default(func) {
  const functions = {};
  functions[func.name] = func;

  if (func.aliases) {
    _lodash.default.each(func.aliases, function (alias) {
      const aliasFn = _lodash.default.clone(func);

      aliasFn.isAlias = true;
      functions[alias] = aliasFn;
    });
  }

  return functions;
}

module.exports = exports.default;