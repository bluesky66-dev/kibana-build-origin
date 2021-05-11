"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axisConfig = axisConfig;

var _moment = _interopRequireDefault(require("moment"));

var _types = require("../../../types");

var _i18n = require("../../../i18n");

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


function axisConfig() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().axisConfig;
  const errors = (0, _i18n.getFunctionErrors)().axisConfig;
  return {
    name: 'axisConfig',
    aliases: [],
    type: 'axisConfig',
    inputTypes: ['null'],
    help,
    args: {
      max: {
        types: ['number', 'string', 'null'],
        help: argHelp.max
      },
      min: {
        types: ['number', 'string', 'null'],
        help: argHelp.min
      },
      position: {
        types: ['string'],
        help: argHelp.position,
        options: Object.values(_types.Position),
        default: 'left'
      },
      show: {
        types: ['boolean'],
        help: argHelp.show,
        default: true
      },
      tickSize: {
        types: ['number', 'null'],
        help: argHelp.tickSize
      }
    },
    fn: (input, args) => {
      const {
        position,
        min,
        max,
        ...rest
      } = args;

      if (!Object.values(_types.Position).includes(position)) {
        throw errors.invalidPosition(position);
      }

      const minVal = typeof min === 'string' ? _moment.default.utc(min).valueOf() : min;
      const maxVal = typeof max === 'string' ? _moment.default.utc(max).valueOf() : max; // This != check is not !== in order to handle NaN cases properly.

      if (minVal != null && isNaN(minVal)) {
        // using `as` because of typing constraint: we know it's a string at this point.
        throw errors.invalidMinDateString(min);
      } // This != check is not !== in order to handle NaN cases properly.


      if (maxVal != null && isNaN(maxVal)) {
        // using `as` because of typing constraint: we know it's a string at this point.
        throw errors.invalidMaxDateString(max);
      }

      return {
        max: maxVal,
        min: minVal,
        type: 'axisConfig',
        position,
        ...rest
      };
    }
  };
}