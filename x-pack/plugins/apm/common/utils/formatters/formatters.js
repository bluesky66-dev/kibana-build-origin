"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asDecimal = asDecimal;
exports.asInteger = asInteger;
exports.asPercent = asPercent;
exports.asDecimalOrInteger = asDecimalOrInteger;

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _i18n = require("../../i18n");

var _is_finite_number = require("../is_finite_number");

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


function asDecimal(value) {
  if (!(0, _is_finite_number.isFiniteNumber)(value)) {
    return _i18n.NOT_AVAILABLE_LABEL;
  }

  return (0, _numeral.default)(value).format('0,0.0');
}

function asInteger(value) {
  if (!(0, _is_finite_number.isFiniteNumber)(value)) {
    return _i18n.NOT_AVAILABLE_LABEL;
  }

  return (0, _numeral.default)(value).format('0,0');
}

function asPercent(numerator, denominator, fallbackResult = _i18n.NOT_AVAILABLE_LABEL) {
  if (!denominator || !(0, _is_finite_number.isFiniteNumber)(numerator)) {
    return fallbackResult;
  }

  const decimal = numerator / denominator; // 33.2 => 33%
  // 3.32 => 3.3%
  // 0 => 0%

  if (Math.abs(decimal) >= 0.1 || decimal === 0) {
    return (0, _numeral.default)(decimal).format('0%');
  }

  return (0, _numeral.default)(decimal).format('0.0%');
}

function asDecimalOrInteger(value) {
  // exact 0 or above 10 should not have decimal
  if (value === 0 || value >= 10) {
    return asInteger(value);
  }

  return asDecimal(value);
}