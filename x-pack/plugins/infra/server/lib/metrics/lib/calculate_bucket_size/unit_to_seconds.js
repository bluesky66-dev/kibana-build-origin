"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUnitValue = exports.getSuitableUnit = exports.convertIntervalToUnit = exports.parseInterval = exports.ASCENDING_UNIT_ORDER = void 0;

var _lodash = require("lodash");

var _interval_regex = require("./interval_regex");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ASCENDING_UNIT_ORDER = ['ms', 's', 'm', 'h', 'd', 'w', 'M', 'y'];
exports.ASCENDING_UNIT_ORDER = ASCENDING_UNIT_ORDER;
const units = {
  ms: 0.001,
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
  w: 86400 * 7,
  M: 86400 * 30,
  y: 86400 * 365
};
const sortedUnits = (0, _lodash.sortBy)(Object.keys(units), key => units[key]);

const parseInterval = intervalString => {
  let value;
  let unit;

  if (intervalString) {
    const matches = intervalString.match(_interval_regex.INTERVAL_STRING_RE);

    if (matches) {
      value = Number(matches[1]);
      unit = matches[2];
    }
  }

  return {
    value,
    unit
  };
};

exports.parseInterval = parseInterval;

const convertIntervalToUnit = (intervalString, newUnit) => {
  const parsedInterval = parseInterval(intervalString);
  let value;
  let unit;

  if (parsedInterval.unit && parsedInterval.value && units[newUnit]) {
    value = Number((parsedInterval.value * units[parsedInterval.unit] / units[newUnit]).toFixed(2));
    unit = newUnit;
  }

  return {
    value,
    unit
  };
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