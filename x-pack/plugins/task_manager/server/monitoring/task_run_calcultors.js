"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateRunningAverage = calculateRunningAverage;
exports.calculateFrequency = calculateFrequency;
exports.createRunningAveragedStat = createRunningAveragedStat;
exports.createMapOfRunningAveragedStats = createMapOfRunningAveragedStats;

var _statsLite = _interopRequireDefault(require("stats-lite"));

var _lodash = require("lodash");

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


function calculateRunningAverage(values) {
  return {
    p50: _statsLite.default.percentile(values, 0.5),
    p90: _statsLite.default.percentile(values, 0.9),
    p95: _statsLite.default.percentile(values, 0.95),
    p99: _statsLite.default.percentile(values, 0.99)
  };
}
/**
 * Calculate the frequency of each term in a list of terms.
 * @param values
 */


function calculateFrequency(values) {
  return values.length ? (0, _lodash.mapValues)((0, _lodash.countBy)(values), count => Math.round(count * 100 / values.length)) : {};
}
/**
 * Utility to keep track of a bounded array of values which changes over time
 * dropping older values as they slide out of the window we wish to track
 */


function createRunningAveragedStat(runningAverageWindowSize) {
  const list = new Array();
  return value => {
    if (!(0, _lodash.isUndefined)(value)) {
      if (list.length === runningAverageWindowSize) {
        list.shift();
      }

      list.push(value);
    } // clone list to ensure it isn't mutated externally


    return [...list];
  };
}

function createMapOfRunningAveragedStats(runningAverageWindowSize) {
  const mappedQueue = {};

  const asRecordOfValues = () => (0, _lodash.mapValues)(mappedQueue, queue => queue());

  return (key, value) => {
    if (!(0, _lodash.isUndefined)(key)) {
      var _mappedQueue$key;

      mappedQueue[key] = (_mappedQueue$key = mappedQueue[key]) !== null && _mappedQueue$key !== void 0 ? _mappedQueue$key : createRunningAveragedStat(runningAverageWindowSize);
      mappedQueue[key](value);
    }

    return asRecordOfValues();
  };
}