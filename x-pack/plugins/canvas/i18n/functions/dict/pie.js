"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = void 0;

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
  help: _i18n.i18n.translate('xpack.canvas.functions.pieHelpText', {
    defaultMessage: 'Configures a pie chart element.'
  }),
  args: {
    font: _i18n.i18n.translate('xpack.canvas.functions.pie.args.fontHelpText', {
      defaultMessage: 'The {CSS} font properties for the labels. For example, {FONT_FAMILY} or {FONT_WEIGHT}.',
      values: {
        CSS: _constants.CSS,
        FONT_FAMILY: _constants.FONT_FAMILY,
        FONT_WEIGHT: _constants.FONT_WEIGHT
      }
    }),
    hole: _i18n.i18n.translate('xpack.canvas.functions.pie.args.holeHelpText', {
      defaultMessage: 'Draws a hole in the pie, between `0` and `100`, as a percentage of the pie radius.'
    }),
    labelRadius: _i18n.i18n.translate('xpack.canvas.functions.pie.args.labelRadiusHelpText', {
      defaultMessage: 'The percentage of the container area to use as a radius for the label circle.'
    }),
    labels: _i18n.i18n.translate('xpack.canvas.functions.pie.args.labelsHelpText', {
      defaultMessage: 'Display the pie labels?'
    }),
    legend: _i18n.i18n.translate('xpack.canvas.functions.pie.args.legendHelpText', {
      defaultMessage: 'The legend position. For example, {legend}, or {BOOLEAN_FALSE}. When {BOOLEAN_FALSE}, the legend is hidden.',
      values: {
        legend: Object.values(_types.Legend).map(position => `\`"${position}"\``).join(', '),
        BOOLEAN_FALSE: _constants.BOOLEAN_FALSE
      }
    }),
    palette: _i18n.i18n.translate('xpack.canvas.functions.pie.args.paletteHelpText', {
      defaultMessage: 'A {palette} object for describing the colors to use in this pie chart.',
      values: {
        palette: '`palette`'
      }
    }),
    radius: _i18n.i18n.translate('xpack.canvas.functions.pie.args.radiusHelpText', {
      defaultMessage: 'The radius of the pie as a percentage, between `0` and `1`, of the available space. ' + 'To automatically set the radius, use {auto}.',
      values: {
        auto: '`"auto"`'
      }
    }),
    seriesStyle: _i18n.i18n.translate('xpack.canvas.functions.pie.args.seriesStyleHelpText', {
      defaultMessage: 'A style of a specific series'
    }),
    tilt: _i18n.i18n.translate('xpack.canvas.functions.pie.args.tiltHelpText', {
      defaultMessage: 'The percentage of tilt where `1` is fully vertical, and `0` is completely flat.'
    })
  }
};
exports.help = help;