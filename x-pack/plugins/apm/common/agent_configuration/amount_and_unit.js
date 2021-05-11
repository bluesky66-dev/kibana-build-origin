"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.amountAndUnitToObject = amountAndUnitToObject;
exports.amountAndUnitToString = amountAndUnitToString;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function amountAndUnitToObject(value) {
  // matches any postive and negative number and its unit.
  const [, amount = '', unit = ''] = value.match(/(^-?\d+)?(\w+)?/) || [];
  return {
    amount: parseInt(amount, 10),
    unit
  };
}

function amountAndUnitToString({
  amount,
  unit
}) {
  return `${amount}${unit}`;
}