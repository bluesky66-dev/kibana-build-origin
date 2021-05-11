"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _moment = _interopRequireDefault(require("moment"));

var _split_interval = _interopRequireDefault(require("./split_interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function _default(tlConfig) {
  const min = (0, _moment.default)(tlConfig.time.from);
  const max = (0, _moment.default)(tlConfig.time.to);
  const intervalParts = (0, _split_interval.default)(tlConfig.time.interval);
  let current = min.startOf(intervalParts.unit);
  const targetSeries = [];

  while (current.valueOf() < max.valueOf()) {
    targetSeries.push(current.valueOf());
    current = current.add(intervalParts.count, intervalParts.unit);
  }

  return targetSeries;
}

module.exports = exports.default;