"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tes;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// Frequency = number of points per season
// Season = 1 hump

/*
Hourly data might have:
 - Daily seasonality (frequency=24)
 - Weekly seasonality (frequency=24×7=168)
 - Annual seasonality (frequency=24×365.25=8766)
*/
// Uh, I don't think this will work when you have nulls in the initial seasonal components
function initSeasonalComponents(samplePoints, seasonLength) {
  const sampledSeasonCount = samplePoints.length / seasonLength;
  let currentSeason = [];

  const seasonalAverages = _lodash.default.reduce(samplePoints, (result, point, i) => {
    currentSeason.push(point); // If this is the end of the season, add it to the result;

    if (i % seasonLength === seasonLength - 1) {
      result.push(_lodash.default.sum(currentSeason) / seasonLength);
      currentSeason = [];
    }

    return result;
  }, []);

  const seasonals = _lodash.default.times(seasonLength, i => {
    let sumOfValsOverAvg = 0;

    _lodash.default.times(sampledSeasonCount, j => {
      sumOfValsOverAvg += samplePoints[seasonLength * j + i] - seasonalAverages[j];
    });

    return sumOfValsOverAvg / sampledSeasonCount;
  });

  return seasonals;
} // This is different from the DES method of establishing trend because it looks for
// the difference in points between seasons


function initTrend(samplePoints, seasonLength) {
  let sum = 0;

  _lodash.default.times(seasonLength, i => {
    sum += (samplePoints[i + seasonLength] - samplePoints[i]) / seasonLength;
  });

  return sum / seasonLength;
}

function tes(points, alpha, beta, gamma, seasonLength, seasonsToSample) {
  const samplePoints = points.slice(0, seasonLength * seasonsToSample);
  const seasonals = initSeasonalComponents(samplePoints, seasonLength);
  let level;
  let prevLevel;
  let trend;
  let prevTrend;
  let unknownCount = 0;

  const result = _lodash.default.map(points, (point, i) => {
    const seasonalPosition = i % seasonLength; // For the first samplePoints.length we use the actual points
    // After that we switch to the forecast

    if (i === 0) {
      trend = initTrend(points, seasonLength);
      level = points[0];
      return points[0];
    } // Beta isn't actually used once we're forecasting?


    if (point == null || i >= samplePoints.length) {
      unknownCount++; // Don't know this point, make it up!

      return level + unknownCount * trend + seasonals[seasonalPosition];
    } else {
      unknownCount = 0; // These 2 variables are not required, but are used for clarity.

      prevLevel = level;
      prevTrend = trend;
      level = alpha * (point - seasonals[seasonalPosition]) + (1 - alpha) * (prevLevel + prevTrend);
      trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;
      seasonals[seasonalPosition] = gamma * (point - level) + (1 - gamma) * seasonals[seasonalPosition];
      return level + trend + seasonals[seasonalPosition];
    }
  });

  return result;
}

module.exports = exports.default;