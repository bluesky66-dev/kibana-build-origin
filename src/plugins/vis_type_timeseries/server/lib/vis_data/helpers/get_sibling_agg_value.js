"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSiblingAggValue = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getSiblingAggValue = (row, metric) => {
  let key = metric.type.replace(/_bucket$/, '');

  if (key === 'std_deviation' && _lodash.default.includes(['upper', 'lower'], metric.mode)) {
    key = `std_deviation_bounds.${metric.mode}`;
  }

  return _lodash.default.get(row, `${metric.id}.${key}`);
};

exports.getSiblingAggValue = getSiblingAggValue;