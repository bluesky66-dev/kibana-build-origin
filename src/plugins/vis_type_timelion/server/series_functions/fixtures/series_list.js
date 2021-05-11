"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _bucket_list = _interopRequireDefault(require("./bucket_list"));

var _get_series = _interopRequireDefault(require("../helpers/get_series"));

var _get_series_list = _interopRequireDefault(require("../helpers/get_series_list"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function _default() {
  return (0, _get_series_list.default)([(0, _get_series.default)('Negative', _bucket_list.default, [-51, 17, 82, 20]), (0, _get_series.default)('Nice', _bucket_list.default, [100, 50, 50, 20]), (0, _get_series.default)('All the same', _bucket_list.default, [1, 1, 1, 1]), (0, _get_series.default)('Decimals', _bucket_list.default, [3.1415926535, 2, 1.439, 0.3424235]), (0, _get_series.default)('PowerOfTen', _bucket_list.default, [10, 100, 10, 1])]);
}

module.exports = exports.default;