"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMoment = getMoment;

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


function getMoment(date) {
  if (!date) {
    return null;
  }

  return (0, _moment.default)(date);
}