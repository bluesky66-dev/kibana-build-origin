"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = asSorted;

var _lodash = _interopRequireDefault(require("lodash"));

var _unzip_pairs = _interopRequireDefault(require("./unzip_pairs.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function asSorted(timeValObject, fn) {
  const data = (0, _unzip_pairs.default)(timeValObject);
  return _lodash.default.fromPairs(fn(data));
}

module.exports = exports.default;