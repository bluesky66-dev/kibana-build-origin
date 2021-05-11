"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBucketSize = void 0;

var _unit_to_seconds = require("./unit_to_seconds");

var _get_timerange = require("./get_timerange");

var _interval_regexp = require("../../../../common/interval_regexp");

var _server = require("../../../../../data/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const calculateBucketData = (timeInterval, capabilities) => {
  let intervalString = capabilities ? capabilities.getValidTimeInterval(timeInterval) : timeInterval;
  const intervalStringMatch = intervalString.match(_interval_regexp.INTERVAL_STRING_RE);
  const parsedInterval = (0, _unit_to_seconds.parseInterval)(intervalString);
  let bucketSize = Number(intervalStringMatch[1]) * (0, _unit_to_seconds.getUnitValue)(intervalStringMatch[2]); // don't go too small

  if (bucketSize < 1) {
    bucketSize = 1;
  } // Check decimal


  if (parsedInterval && parsedInterval.value % 1 !== 0) {
    if (parsedInterval.unit !== 'ms') {
      const converted = (0, _unit_to_seconds.convertIntervalToUnit)(intervalString, _unit_to_seconds.ASCENDING_UNIT_ORDER[_unit_to_seconds.ASCENDING_UNIT_ORDER.indexOf(parsedInterval.unit) - 1]);

      if (converted) {
        intervalString = converted.value + converted.unit;
      }

      intervalString = undefined;
    } else {
      intervalString = '1ms';
    }
  }

  return {
    bucketSize,
    intervalString
  };
};

const calculateBucketSizeForAutoInterval = (req, maxBars) => {
  const {
    from,
    to
  } = (0, _get_timerange.getTimerange)(req);
  const timerange = to.valueOf() - from.valueOf();
  return _server.search.aggs.calcAutoIntervalLessThan(maxBars, timerange).asSeconds();
};

const getBucketSize = (req, interval, capabilities, maxBars) => {
  const bucketSize = calculateBucketSizeForAutoInterval(req, maxBars);
  let intervalString = `${bucketSize}s`;
  const gteAutoMatch = Boolean(interval) && interval.match(_interval_regexp.GTE_INTERVAL_RE);

  if (gteAutoMatch) {
    const bucketData = calculateBucketData(gteAutoMatch[1], capabilities);

    if (bucketData.bucketSize >= bucketSize) {
      return bucketData;
    }
  }

  const matches = interval && interval.match(_interval_regexp.INTERVAL_STRING_RE);

  if (matches) {
    intervalString = interval;
  }

  return calculateBucketData(intervalString, capabilities);
};

exports.getBucketSize = getBucketSize;