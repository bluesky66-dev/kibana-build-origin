"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUnsupportedChartData = exports.isOrdinalChartData = exports.isNumericChartData = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isNumericChartData = arg => {
  return typeof arg === 'object' && arg.hasOwnProperty('data') && arg.hasOwnProperty('id') && arg.hasOwnProperty('interval') && arg.hasOwnProperty('stats') && arg.hasOwnProperty('type') && arg.type === 'numeric';
};

exports.isNumericChartData = isNumericChartData;

const isOrdinalChartData = arg => {
  return typeof arg === 'object' && arg.hasOwnProperty('data') && arg.hasOwnProperty('cardinality') && arg.hasOwnProperty('id') && arg.hasOwnProperty('type') && (arg.type === 'ordinal' || arg.type === 'boolean');
};

exports.isOrdinalChartData = isOrdinalChartData;

const isUnsupportedChartData = arg => {
  return typeof arg === 'object' && arg.hasOwnProperty('type') && arg.type === 'unsupported';
};

exports.isUnsupportedChartData = isUnsupportedChartData;