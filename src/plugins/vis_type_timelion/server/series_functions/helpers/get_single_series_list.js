"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _get_series = _interopRequireDefault(require("./get_series"));

var _get_series_list = _interopRequireDefault(require("./get_series_list"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function _default(name, data) {
  return (0, _get_series_list.default)([(0, _get_series.default)(name, _lodash.default.map(data, 0), _lodash.default.map(data, 1))]);
}

module.exports = exports.default;