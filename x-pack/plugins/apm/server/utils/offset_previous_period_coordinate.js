"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.offsetPreviousPeriodCoordinates = offsetPreviousPeriodCoordinates;

var _moment = _interopRequireDefault(require("moment"));

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


function offsetPreviousPeriodCoordinates({
  currentPeriodStart,
  previousPeriodStart,
  previousPeriodTimeseries
}) {
  if (!previousPeriodTimeseries) {
    return [];
  }

  const dateOffset = (0, _moment.default)(currentPeriodStart).diff((0, _moment.default)(previousPeriodStart));
  return previousPeriodTimeseries.map(({
    x,
    y
  }) => {
    const offsetX = (0, _moment.default)(x).add(dateOffset).valueOf();
    return {
      x: offsetX,
      y
    };
  });
}