"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseScheduleDates = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

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


const parseScheduleDates = time => {
  const isValidDateString = !isNaN(Date.parse(time));
  const isValidInput = isValidDateString || time.trim().startsWith('now');
  const formattedDate = isValidDateString ? (0, _moment.default)(time) : isValidInput ? _datemath.default.parse(time) : null;
  return formattedDate !== null && formattedDate !== void 0 ? formattedDate : null;
};

exports.parseScheduleDates = parseScheduleDates;