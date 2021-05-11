"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pctToDecimal = exports.decimalToPct = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const correctedPctConvert = (v, decimalToPct) => {
  // Correct floating point precision
  const replacementPattern = decimalToPct ? new RegExp(/0?\./) : '.';
  const numberOfDigits = String(v).replace(replacementPattern, '').length;
  const multipliedValue = decimalToPct ? v * 100 : v / 100;
  return parseFloat(multipliedValue.toPrecision(numberOfDigits));
};

const decimalToPct = v => correctedPctConvert(v, true);

exports.decimalToPct = decimalToPct;

const pctToDecimal = v => correctedPctConvert(v, false);

exports.pctToDecimal = pctToDecimal;