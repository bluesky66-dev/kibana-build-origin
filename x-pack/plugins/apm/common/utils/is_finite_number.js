"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFiniteNumber = isFiniteNumber;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// _.isNumber() returns true for NaN, _.isFinite() does not refine


function isFiniteNumber(value) {
  return (0, _lodash.isFinite)(value);
}