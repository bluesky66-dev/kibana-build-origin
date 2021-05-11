"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareTimeKeys = compareTimeKeys;
exports.getNextTimeKey = exports.getPreviousTimeKey = exports.timeKeyIsBetween = exports.getIndexAtTimeKey = exports.compareToTimeKey = exports.pickTimeKey = exports.isTimeKey = void 0;

var _d3Array = require("d3-array");

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isTimeKey = value => value && typeof value === 'object' && typeof value.time === 'number' && typeof value.tiebreaker === 'number';

exports.isTimeKey = isTimeKey;

const pickTimeKey = value => (0, _lodash.pick)(value, ['time', 'tiebreaker']);

exports.pickTimeKey = pickTimeKey;

function compareTimeKeys(firstKey, secondKey, compareValues = _d3Array.ascending) {
  const timeComparison = compareValues(firstKey.time, secondKey.time);

  if (timeComparison === 0) {
    const tiebreakerComparison = compareValues(firstKey.tiebreaker, secondKey.tiebreaker);

    if (tiebreakerComparison === 0 && typeof firstKey.gid !== 'undefined' && typeof secondKey.gid !== 'undefined') {
      return compareValues(firstKey.gid, secondKey.gid);
    }

    return tiebreakerComparison;
  }

  return timeComparison;
}

const compareToTimeKey = (keyAccessor, compareValues) => (value, key) => compareTimeKeys(keyAccessor(value), key, compareValues);

exports.compareToTimeKey = compareToTimeKey;

const getIndexAtTimeKey = (keyAccessor, compareValues) => {
  const comparator = compareToTimeKey(keyAccessor, compareValues);
  const collectionBisector = (0, _d3Array.bisector)(comparator);
  return (collection, key) => {
    const index = collectionBisector.left(collection, key);

    if (index >= collection.length) {
      return null;
    }

    if (comparator(collection[index], key) !== 0) {
      return null;
    }

    return index;
  };
};

exports.getIndexAtTimeKey = getIndexAtTimeKey;

const timeKeyIsBetween = (min, max, operand) => compareTimeKeys(min, operand) <= 0 && compareTimeKeys(max, operand) >= 0;

exports.timeKeyIsBetween = timeKeyIsBetween;

const getPreviousTimeKey = timeKey => ({ ...timeKey,
  time: timeKey.time,
  tiebreaker: timeKey.tiebreaker - 1
});

exports.getPreviousTimeKey = getPreviousTimeKey;

const getNextTimeKey = timeKey => ({ ...timeKey,
  time: timeKey.time,
  tiebreaker: timeKey.tiebreaker + 1
});

exports.getNextTimeKey = getNextTimeKey;