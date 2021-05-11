"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = des;

var _i18n = require("@kbn/i18n");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function des(points, alpha, beta) {
  let level;
  let prevLevel;
  let trend;
  let prevTrend;
  let unknownCount = 0;

  if (points.length < 2) {
    throw new Error(_i18n.i18n.translate('timelion.serverSideErrors.holtFunction.notEnoughPointsErrorMessage', {
      defaultMessage: 'You need at least 2 points to use double exponential smoothing'
    }));
  }

  const smoothedPoints = _lodash.default.map(points, (point, i) => {
    if (i === 0) {
      return point;
    }

    if (i === 1) {
      // Establish initial values for level and trend;
      level = points[0];
      trend = points[1] - points[0]; // This is sort of a lame way to do this
    }

    if (point == null) {
      unknownCount++;
    } else {
      unknownCount = 0; // These 2 variables are not required, but are used for clarity.

      prevLevel = level;
      prevTrend = trend;
      level = alpha * point + (1 - alpha) * (prevLevel + prevTrend);
      trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;
    }

    return level + unknownCount * trend;
  }, []);

  return smoothedPoints;
}

module.exports = exports.default;