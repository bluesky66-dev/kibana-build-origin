"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeTime = exports.deserializeTime = void 0;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deserializeTime = time => {
  const timeUnits = Object.values(_constants.TIME_UNITS);
  const timeUnit = timeUnits.find(unit => {
    const unitIndex = time.indexOf(unit);
    return unitIndex !== -1 && unitIndex === time.length - 1;
  });

  if (timeUnit) {
    const timeValue = Number(time.replace(timeUnit, ''));

    if (!isNaN(timeValue)) {
      return {
        timeValue,
        timeUnit
      };
    }
  }

  return {};
};

exports.deserializeTime = deserializeTime;

const serializeTime = (timeValue, timeUnit) => {
  return `${timeValue}${timeUnit}`; // e.g., '15d'
};

exports.serializeTime = serializeTime;