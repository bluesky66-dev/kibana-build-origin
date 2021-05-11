"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateTimeSeriesInterval = exports.calculateAuto = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _fp = require("lodash/fp");

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

/*
 ** Applying the same logic as:
 ** x-pack/plugins/apm/server/lib/helpers/get_bucket_size/calculate_auto.js
 */


const d = _moment.default.duration;
const roundingRules = [[d(500, 'ms'), d(100, 'ms')], [d(5, 'second'), d(1, 'second')], [d(7.5, 'second'), d(5, 'second')], [d(15, 'second'), d(10, 'second')], [d(45, 'second'), d(30, 'second')], [d(3, 'minute'), d(1, 'minute')], [d(9, 'minute'), d(5, 'minute')], [d(20, 'minute'), d(10, 'minute')], [d(45, 'minute'), d(30, 'minute')], [d(2, 'hour'), d(1, 'hour')], [d(6, 'hour'), d(3, 'hour')], [d(24, 'hour'), d(12, 'hour')], [d(1, 'week'), d(1, 'd')], [d(3, 'week'), d(1, 'week')], [d(1, 'year'), d(1, 'month')], [Infinity, d(1, 'year')]];
const revRoundingRules = roundingRules.slice(0).reverse();

const find = (rules, check, last) => {
  const pick = (buckets, duration) => {
    const target = typeof duration === 'number' ? duration / buckets : duration.asMilliseconds() / buckets;
    let lastResp = null;

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const resp = check(rule[0], rule[1], target);

      if (resp == null) {
        if (last) {
          if (lastResp) return lastResp;
          break;
        }
      }

      if (!last && resp) return resp;
      lastResp = resp;
    } // fallback to just a number of milliseconds, ensure ms is >= 1


    const ms = Math.max(Math.floor(target), 1);
    return _moment.default.duration(ms, 'ms');
  };

  return (buckets, duration) => {
    const interval = pick(buckets, duration);
    const intervalData = (0, _fp.get)('_data', interval);
    if (intervalData) return _moment.default.duration(intervalData);
  };
};

const calculateAuto = {
  near: find(revRoundingRules, (bound, interval, target) => {
    if (bound > target) return interval;
  }, true),
  lessThan: find(revRoundingRules, (_bound, interval, target) => {
    if (interval < target) return interval;
  }),
  atLeast: find(revRoundingRules, (_bound, interval, target) => {
    if (interval <= target) return interval;
  })
};
exports.calculateAuto = calculateAuto;

const calculateTimeSeriesInterval = (from, to) => {
  return `${Math.floor((0, _moment.default)(to).diff((0, _moment.default)(from)) / 32)}ms`;
};

exports.calculateTimeSeriesInterval = calculateTimeSeriesInterval;