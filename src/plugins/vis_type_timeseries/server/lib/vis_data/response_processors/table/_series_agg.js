"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SeriesAgg = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function mean(values) {
  return _lodash.default.sum(values) / values.length;
}

const basic = fnName => targetSeries => {
  const data = [];

  _lodash.default.zip(...targetSeries).forEach(row => {
    const key = row[0][0];
    const values = row.map(r => r[1]);

    const fn = _lodash.default[fnName] || (() => null);

    data.push([key, fn(values)]);
  });

  return [data];
};

const overall = fnName => targetSeries => {
  const fn = _lodash.default[fnName];
  const keys = [];
  const values = [];

  _lodash.default.zip(...targetSeries).forEach(row => {
    keys.push(row[0][0]);
    values.push(fn(row.map(r => r[1])));
  });

  return [keys.map(k => [k, fn(values)])];
};

const SeriesAgg = {
  sum: basic('sum'),
  max: basic('max'),
  min: basic('min'),

  mean(targetSeries) {
    const data = [];

    _lodash.default.zip(...targetSeries).forEach(row => {
      const key = row[0][0];
      const values = row.map(r => r[1]);
      data.push([key, mean(values)]);
    });

    return [data];
  },

  overall_max: overall('max'),
  overall_min: overall('min'),
  overall_sum: overall('sum'),

  overall_avg(targetSeries) {
    const fn = mean;
    const keys = [];
    const values = [];

    _lodash.default.zip(...targetSeries).forEach(row => {
      keys.push(row[0][0]);
      values.push(_lodash.default.sum(row.map(r => r[1])));
    });

    return [keys.map(k => [k, fn(values)])];
  },

  cumulative_sum(targetSeries) {
    const data = [];
    let sum = 0;

    _lodash.default.zip(...targetSeries).forEach(row => {
      const key = row[0][0];
      sum += _lodash.default.sum(row.map(r => r[1]));
      data.push([key, sum]);
    });

    return [data];
  }

};
exports.SeriesAgg = SeriesAgg;