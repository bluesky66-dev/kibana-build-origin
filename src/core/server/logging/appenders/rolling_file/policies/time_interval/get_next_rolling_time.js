"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNextRollingTime = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Return the next rollout time, given current time and rollout interval
 */
const getNextRollingTime = (currentTime, interval, modulate) => {
  if (modulate) {
    const incrementedUnit = (0, _utils.getHighestTimeUnit)(interval);
    const currentMoment = (0, _momentTimezone.default)(currentTime);
    const increment = interval.get(incrementedUnit) - currentMoment.get(incrementedUnit) % interval.get(incrementedUnit);

    const incrementInMs = _momentTimezone.default.duration(increment, incrementedUnit).asMilliseconds();

    return currentMoment.startOf(incrementedUnit).toDate().getTime() + incrementInMs;
  } else {
    return currentTime + interval.asMilliseconds();
  }
};

exports.getNextRollingTime = getNextRollingTime;