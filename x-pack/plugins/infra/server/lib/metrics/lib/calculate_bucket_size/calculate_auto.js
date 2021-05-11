"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateAuto = void 0;

var _moment = _interopRequireWildcard(require("moment"));

var _lodash = require("lodash");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const d = _moment.default.duration;
const roundingRules = [[d(500, 'ms'), d(100, 'ms')], [d(5, 'second'), d(1, 'second')], [d(7.5, 'second'), d(5, 'second')], [d(15, 'second'), d(10, 'second')], [d(45, 'second'), d(30, 'second')], [d(3, 'minute'), d(1, 'minute')], [d(9, 'minute'), d(5, 'minute')], [d(20, 'minute'), d(10, 'minute')], [d(45, 'minute'), d(30, 'minute')], [d(2, 'hour'), d(1, 'hour')], [d(6, 'hour'), d(3, 'hour')], [d(24, 'hour'), d(12, 'hour')], [d(1, 'week'), d(1, 'd')], [d(3, 'week'), d(1, 'week')], [d(1, 'year'), d(1, 'month')], [Infinity, d(1, 'year')]];
const revRoundingRules = [...roundingRules].reverse();

function findRule(rules, check, last) {
  function pickInterval(buckets, duration) {
    const target = duration.asMilliseconds() / buckets;
    let lastResult = null;

    for (const rule of rules) {
      const result = check(rule[0], rule[1], target);

      if (result == null) {
        if (!last) continue;
        if (lastResult) return lastResult;
        break;
      }

      if (!last) return result;
      lastResult = result;
    } // fallback to just a number of milliseconds, ensure ms is >= 1


    const ms = Math.max(Math.floor(target), 1);
    return _moment.default.duration(ms, 'ms');
  }

  return (buckets, duration) => {
    const interval = pickInterval(buckets, duration);
    if ((0, _moment.isDuration)(interval)) return interval;
  };
}

const calculateAuto = {
  near: findRule(revRoundingRules, function near(bound, interval, target) {
    if ((0, _moment.isDuration)(bound) && bound.asMilliseconds() > target) return interval;
    if ((0, _lodash.isNumber)(bound) && bound > target) return interval;
  }, true),
  lessThan: findRule(revRoundingRules, function lessThan(_bound, interval, target) {
    if (interval.asMilliseconds() < target) return interval;
  }),
  atLeast: findRule(revRoundingRules, function atLeast(_bound, interval, target) {
    if (interval.asMilliseconds() <= target) return interval;
  })
};
exports.calculateAuto = calculateAuto;