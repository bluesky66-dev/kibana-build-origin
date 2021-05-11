"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _progress = require("../../../canvas_plugin_src/functions/common/progress");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.progressHelpText', {
    defaultMessage: 'Configures a progress element.'
  }),
  args: {
    barColor: _i18n.i18n.translate('xpack.canvas.functions.progress.args.barColorHelpText', {
      defaultMessage: 'The color of the background bar.'
    }),
    barWeight: _i18n.i18n.translate('xpack.canvas.functions.progress.args.barWeightHelpText', {
      defaultMessage: 'The thickness of the background bar.'
    }),
    font: _i18n.i18n.translate('xpack.canvas.functions.progress.args.fontHelpText', {
      defaultMessage: 'The {CSS} font properties for the label. For example, {FONT_FAMILY} or {FONT_WEIGHT}.',
      values: {
        CSS: _constants.CSS,
        FONT_FAMILY: _constants.FONT_FAMILY,
        FONT_WEIGHT: _constants.FONT_WEIGHT
      }
    }),
    label: _i18n.i18n.translate('xpack.canvas.functions.progress.args.labelHelpText', {
      defaultMessage: 'To show or hide the label, use {BOOLEAN_TRUE} or {BOOLEAN_FALSE}. Alternatively, provide a string to display as a label.',
      values: {
        BOOLEAN_TRUE: _constants.BOOLEAN_TRUE,
        BOOLEAN_FALSE: _constants.BOOLEAN_FALSE
      }
    }),
    max: _i18n.i18n.translate('xpack.canvas.functions.progress.args.maxHelpText', {
      defaultMessage: 'The maximum value of the progress element.'
    }),
    shape: _i18n.i18n.translate('xpack.canvas.functions.progress.args.shapeHelpText', {
      defaultMessage: `Select {list}, or {end}.`,
      values: {
        list: Object.values(_progress.Shape).slice(0, -1).map(shape => `\`"${shape}"\``).join(', '),
        end: `\`"${Object.values(_progress.Shape).slice(-1)[0]}"\``
      }
    }),
    valueColor: _i18n.i18n.translate('xpack.canvas.functions.progress.args.valueColorHelpText', {
      defaultMessage: 'The color of the progress bar.'
    }),
    valueWeight: _i18n.i18n.translate('xpack.canvas.functions.progress.args.valueWeightHelpText', {
      defaultMessage: 'The thickness of the progress bar.'
    })
  }
};
exports.help = help;
const errors = {
  invalidMaxValue: max => new Error(_i18n.i18n.translate('xpack.canvas.functions.progress.invalidMaxValueErrorMessage', {
    defaultMessage: "Invalid {arg} value: '{max, number}'. '{arg}' must be greater than 0",
    values: {
      arg: 'max',
      max
    }
  })),
  invalidValue: (value, max = 1) => new Error(_i18n.i18n.translate('xpack.canvas.functions.progress.invalidValueErrorMessage', {
    defaultMessage: "Invalid value: '{value, number}'. Value must be between 0 and {max, number}",
    values: {
      value,
      max
    }
  }))
};
exports.errors = errors;