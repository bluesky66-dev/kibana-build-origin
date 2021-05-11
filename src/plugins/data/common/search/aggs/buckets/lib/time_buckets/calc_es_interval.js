"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertDurationToNormalizedEsInterval = convertDurationToNormalizedEsInterval;
exports.convertIntervalToEsInterval = convertIntervalToEsInterval;

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _utils = require("../../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const unitsDesc = _datemath.default.unitsDesc;
const largeMax = unitsDesc.indexOf('M');

/**
 * Convert a moment.duration into an es
 * compatible expression, and provide
 * associated metadata
 *
 * @param  {moment.duration} duration
 * @return {object}
 */
function convertDurationToNormalizedEsInterval(duration) {
  for (let i = 0; i < unitsDesc.length; i++) {
    const unit = unitsDesc[i];
    const val = duration.as(unit); // find a unit that rounds neatly

    if (val >= 1 && Math.floor(val) === val) {
      // if the unit is "large", like years, but
      // isn't set to 1 ES will puke. So keep going until
      // we get out of the "large" units
      if (i <= largeMax && val !== 1) {
        continue;
      }

      return {
        value: val,
        unit,
        expression: val + unit
      };
    }
  }

  const ms = duration.as('ms');
  return {
    value: ms,
    unit: 'ms',
    expression: ms + 'ms'
  };
}

function convertIntervalToEsInterval(interval) {
  const {
    value,
    unit
  } = (0, _utils.parseEsInterval)(interval);
  return {
    value,
    unit,
    expression: interval
  };
}