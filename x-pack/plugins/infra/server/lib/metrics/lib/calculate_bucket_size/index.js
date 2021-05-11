"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateBucketSize = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _calculate_auto = require("./calculate_auto");

var _unit_to_seconds = require("./unit_to_seconds");

var _interval_regex = require("./interval_regex");

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


const calculateBucketData = intervalString => {
  const intervalStringMatch = intervalString.match(_interval_regex.INTERVAL_STRING_RE);

  if (!intervalStringMatch) {
    throw new Error('Unable to parse interval string');
  }

  const parsedInterval = (0, _unit_to_seconds.parseInterval)(intervalString);

  if (!parsedInterval) {
    throw new Error('Unable to parse interval string');
  }

  let bucketSize = Number(intervalStringMatch[1]) * (0, _unit_to_seconds.getUnitValue)(intervalStringMatch[2]); // don't go too small

  if (bucketSize < 1) {
    bucketSize = 1;
  } // Check decimal


  if (parsedInterval.value && parsedInterval.value % 1 !== 0) {
    if (parsedInterval.unit && parsedInterval.unit !== 'ms') {
      const {
        value,
        unit
      } = (0, _unit_to_seconds.convertIntervalToUnit)(intervalString, _unit_to_seconds.ASCENDING_UNIT_ORDER[_unit_to_seconds.ASCENDING_UNIT_ORDER.indexOf(parsedInterval.unit) - 1]);

      if (value && unit) {
        intervalString = value + unit;
      } else {
        intervalString = '1ms';
      }
    } else {
      intervalString = '1ms';
    }
  }

  return {
    bucketSize,
    intervalString
  };
};

const calculateBucketSizeForAutoInterval = timerange => {
  const duration = _moment.default.duration(timerange.to - timerange.from, 'ms');

  const bucketSizeDuration = _calculate_auto.calculateAuto.near(100, duration);

  if (bucketSizeDuration) {
    return bucketSizeDuration.asSeconds();
  }
};

const calculateBucketSize = timerange => {
  const bucketSize = calculateBucketSizeForAutoInterval(timerange);
  let intervalString = `${bucketSize}s`;
  const gteAutoMatch = timerange.interval.match(_interval_regex.GTE_INTERVAL_RE);

  if (gteAutoMatch) {
    const bucketData = calculateBucketData(gteAutoMatch[1]);

    if (bucketSize && bucketData.bucketSize >= bucketSize) {
      return bucketData;
    }
  }

  const matches = timerange.interval.match(_interval_regex.INTERVAL_STRING_RE);

  if (matches) {
    intervalString = timerange.interval;
  }

  return calculateBucketData(intervalString);
};

exports.calculateBucketSize = calculateBucketSize;