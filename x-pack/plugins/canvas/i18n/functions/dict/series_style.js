"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.seriesStyleHelpText', {
    defaultMessage: 'Creates an object used for describing the properties of a series on a chart. ' + 'Use {seriesStyleFn} inside of a charting function, like {plotFn} or {pieFn}.',
    values: {
      seriesStyleFn: '`seriesStyle`',
      pieFn: '`pie`',
      plotFn: '`plot`'
    }
  }),
  args: {
    bars: _i18n.i18n.translate('xpack.canvas.functions.seriesStyle.args.barsHelpText', {
      defaultMessage: 'The width of bars.'
    }),
    color: _i18n.i18n.translate('xpack.canvas.functions.seriesStyle.args.colorHelpText', {
      defaultMessage: 'The line color.'
    }),
    fill: _i18n.i18n.translate('xpack.canvas.functions.seriesStyle.args.fillHelpText', {
      defaultMessage: 'Should we fill in the points?'
    }),
    horizontalBars: _i18n.i18n.translate('xpack.canvas.functions.seriesStyle.args.horizontalBarsHelpText', {
      defaultMessage: 'Sets the orientation of the bars in the chart to horizontal.'
    }),
    label: _i18n.i18n.translate('xpack.canvas.functions.seriesStyle.args.labelHelpText', {
      defaultMessage: 'The name of the series to style.'
    }),
    lines: _i18n.i18n.translate('xpack.canvas.functions.seriesStyle.args.linesHelpText', {
      defaultMessage: 'The width of the line.'
    }),
    points: _i18n.i18n.translate('xpack.canvas.functions.seriesStyle.args.pointsHelpText', {
      defaultMessage: 'The size of points on line.'
    }),
    stack: _i18n.i18n.translate('xpack.canvas.functions.seriesStyle.args.stackHelpText', {
      defaultMessage: 'Specifies if the series should be stacked. The number is the stack ID. ' + 'Series with the same stack ID are stacked together.'
    })
  }
};
exports.help = help;