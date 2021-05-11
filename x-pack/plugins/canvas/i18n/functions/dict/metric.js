"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.metricHelpText', {
    defaultMessage: 'Displays a number over a label.'
  }),
  args: {
    label: _i18n.i18n.translate('xpack.canvas.functions.metric.args.labelHelpText', {
      defaultMessage: 'The text describing the metric.'
    }),
    labelFont: _i18n.i18n.translate('xpack.canvas.functions.metric.args.labelFontHelpText', {
      defaultMessage: 'The {CSS} font properties for the label. For example, {FONT_FAMILY} or {FONT_WEIGHT}.',
      values: {
        CSS: _constants.CSS,
        FONT_FAMILY: _constants.FONT_FAMILY,
        FONT_WEIGHT: _constants.FONT_WEIGHT
      }
    }),
    metricFont: _i18n.i18n.translate('xpack.canvas.functions.metric.args.metricFontHelpText', {
      defaultMessage: 'The {CSS} font properties for the metric. For example, {FONT_FAMILY} or {FONT_WEIGHT}.',
      values: {
        CSS: _constants.CSS,
        FONT_FAMILY: _constants.FONT_FAMILY,
        FONT_WEIGHT: _constants.FONT_WEIGHT
      }
    }),
    // TODO: Find a way to generate the docs URL here
    metricFormat: _i18n.i18n.translate('xpack.canvas.functions.metric.args.metricFormatHelpText', {
      defaultMessage: 'A {NUMERALJS} format string. For example, {example1} or {example2}.',
      values: {
        example1: '`"0.0a"`',
        example2: '`"0%"`',
        NUMERALJS: _constants.NUMERALJS
      }
    })
  }
};
exports.help = help;