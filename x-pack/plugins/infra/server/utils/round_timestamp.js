"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roundTimestamp = void 0;

var _moment = _interopRequireDefault(require("moment"));

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


const roundTimestamp = (timestamp, unit) => {
  const floor = (0, _moment.default)(timestamp).startOf(unit).valueOf();
  const ceil = (0, _moment.default)(timestamp).add(1, unit).startOf(unit).valueOf();
  if (Math.abs(timestamp - floor) <= Math.abs(timestamp - ceil)) return floor;
  return ceil;
};

exports.roundTimestamp = roundTimestamp;