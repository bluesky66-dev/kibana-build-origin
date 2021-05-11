"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUnitValue = exports.getSuitableUnit = exports.convertIntervalToUnit = exports.parseInterval = exports.ASCENDING_UNIT_ORDER = void 0;

var _lodash = require("lodash");

var _interval_regexp = require("../../../../common/interval_regexp");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @ts-ignore */
const ASCENDING_UNIT_ORDER = ['ms', 's', 'm', 'h', 'd', 'w', 'M', 'y'];
exports.ASCENDING_UNIT_ORDER = ASCENDING_UNIT_ORDER;
const units = {
  ms: 0.001,
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
  w: 86400 * 7,
  // Hum... might be wrong
  M: 86400 * 7 * 4,
  // this too... 29,30,31?
  y: 86400 * 7 * 4 * 12 // Leap year?

};
const sortedUnits = (0, _lodash.sortBy)(Object.keys(units), key => units[key]);

const parseInterval = intervalString => {
  if (intervalString) {
    const matches = intervalString.match(_interval_regexp.INTERVAL_STRING_RE);

    if (matches) {
      return {
        value: Number(matches[1]),
        unit: matches[2]
      };
    }
  }
};

exports.parseInterval = parseInterval;

const convertIntervalToUnit = (intervalString, newUnit) => {
  const parsedInterval = parseInterval(intervalString);

  if (parsedInterval && units[newUnit]) {
    return {
      value: Number((parsedInterval.value * units[parsedInterval.unit] / units[newUnit]).toFixed(2)),
      unit: newUnit
    };
  }
};

exports.convertIntervalToUnit = convertIntervalToUnit;

const getSuitableUnit = intervalInSeconds => sortedUnits.find((key, index, array) => {
  const nextUnit = array[index + 1];
  const isValidInput = (0, _lodash.isNumber)(intervalInSeconds) && intervalInSeconds > 0;
  const isLastItem = index + 1 === array.length;
  return isValidInput && (intervalInSeconds >= units[key] && intervalInSeconds < units[nextUnit] || isLastItem);
});

exports.getSuitableUnit = getSuitableUnit;

const getUnitValue = unit => units[unit];

exports.getUnitValue = getUnitValue;