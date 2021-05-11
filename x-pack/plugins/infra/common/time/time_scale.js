"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decomposeIntoUnits = exports.getLabelOfScale = exports.getMillisOfScale = void 0;

var _time_unit = require("./time_unit");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getMillisOfScale = scale => scale.unit * scale.value;

exports.getMillisOfScale = getMillisOfScale;

const getLabelOfScale = scale => `${scale.value}${_time_unit.timeUnitLabels[scale.unit]}`;

exports.getLabelOfScale = getLabelOfScale;

const decomposeIntoUnits = (time, units) => units.reduce((result, unitMillis) => {
  const offset = result.reduce((accumulatedOffset, timeScale) => accumulatedOffset + getMillisOfScale(timeScale), 0);
  const value = Math.floor((time - offset) / unitMillis);

  if (value > 0) {
    return [...result, {
      unit: unitMillis,
      value
    }];
  } else {
    return result;
  }
}, []);

exports.decomposeIntoUnits = decomposeIntoUnits;