"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../../../types");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.axisConfigHelpText', {
    defaultMessage: 'Configures the axis of a visualization. Only used with {plotFn}.',
    values: {
      plotFn: '`plot`'
    }
  }),
  args: {
    max: _i18n.i18n.translate('xpack.canvas.functions.axisConfig.args.maxHelpText', {
      defaultMessage: 'The maximum value displayed in the axis. Must be a number, a date in milliseconds since epoch, or an {ISO8601} string.',
      values: {
        ISO8601: _constants.ISO8601
      }
    }),
    min: _i18n.i18n.translate('xpack.canvas.functions.axisConfig.args.minHelpText', {
      defaultMessage: 'The minimum value displayed in the axis. Must be a number, a date in milliseconds since epoch, or an {ISO8601} string.',
      values: {
        ISO8601: _constants.ISO8601
      }
    }),
    position: _i18n.i18n.translate('xpack.canvas.functions.axisConfig.args.positionHelpText', {
      defaultMessage: 'The position of the axis labels. For example, {list}, or {end}.',
      values: {
        list: Object.values(_types.Position).slice(0, -1).map(position => `\`"${position}"\``).join(', '),
        end: `\`"${Object.values(_types.Position).slice(-1)[0]}"\``
      }
    }),
    show: _i18n.i18n.translate('xpack.canvas.functions.axisConfig.args.showHelpText', {
      defaultMessage: 'Show the axis labels?'
    }),
    tickSize: _i18n.i18n.translate('xpack.canvas.functions.axisConfig.args.tickSizeHelpText', {
      defaultMessage: 'The increment size between each tick. Use for `number` axes only.'
    })
  }
};
exports.help = help;
const errors = {
  invalidPosition: position => new Error(_i18n.i18n.translate('xpack.canvas.functions.axisConfig.invalidPositionErrorMessage', {
    defaultMessage: "Invalid position: '{position}'",
    values: {
      position
    }
  })),
  invalidMinDateString: min => new Error(_i18n.i18n.translate('xpack.canvas.functions.axisConfig.invalidMinDateStringErrorMessage', {
    defaultMessage: "Invalid date string: '{min}'. 'min' must be a number, date in ms, or ISO8601 date string",
    values: {
      min
    }
  })),
  invalidMaxDateString: max => new Error(_i18n.i18n.translate('xpack.canvas.functions.axisConfig.invalidMaxPositionErrorMessage', {
    defaultMessage: "Invalid date string: '{max}'. 'max' must be a number, date in ms, or ISO8601 date string",
    values: {
      max
    }
  }))
};
exports.errors = errors;