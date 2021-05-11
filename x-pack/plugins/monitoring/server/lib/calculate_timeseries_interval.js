"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateTimeseriesInterval = calculateTimeseriesInterval;

var _moment = _interopRequireDefault(require("moment"));

var _calculate_auto = require("./calculate_auto");

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


function calculateTimeseriesInterval(lowerBoundInMsSinceEpoch, upperBoundInMsSinceEpoch, minIntervalSeconds) {
  const duration = _moment.default.duration(upperBoundInMsSinceEpoch - lowerBoundInMsSinceEpoch, 'ms');

  return Math.max(minIntervalSeconds, (0, _calculate_auto.calculateAuto)(100, duration).asSeconds());
}