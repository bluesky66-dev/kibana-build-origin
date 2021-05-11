"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.pointseriesHelpText', {
    defaultMessage: 'Turn a {DATATABLE} into a point series model. Currently we differentiate measure ' + 'from dimensions by looking for a {TINYMATH} expression. See {TINYMATH_URL}. If you enter a {TINYMATH} expression in your ' + 'argument, we treat that argument as a measure, otherwise it is a dimension. Dimensions ' + 'are combined to create unique keys. Measures are then deduplicated by those keys using ' + 'the specified {TINYMATH} function',
    values: {
      DATATABLE: _constants.DATATABLE,
      TINYMATH: _constants.TINYMATH,
      TINYMATH_URL: _constants.TINYMATH_URL
    }
  }),
  args: {
    color: _i18n.i18n.translate('xpack.canvas.functions.pointseries.args.colorHelpText', {
      defaultMessage: "An expression to use in determining the mark's color."
    }),
    size: _i18n.i18n.translate('xpack.canvas.functions.pointseries.args.sizeHelpText', {
      defaultMessage: 'The size of the marks. Only applicable to supported elements.'
    }),
    text: _i18n.i18n.translate('xpack.canvas.functions.pointseries.args.textHelpText', {
      defaultMessage: 'The text to show on the mark. Only applicable to supported elements.'
    }),
    x: _i18n.i18n.translate('xpack.canvas.functions.pointseries.args.xHelpText', {
      defaultMessage: 'The values along the X-axis.'
    }),
    y: _i18n.i18n.translate('xpack.canvas.functions.pointseries.args.yHelpText', {
      defaultMessage: 'The values along the Y-axis.'
    })
  }
};
exports.help = help;
const errors = {
  unwrappedExpression: () => new Error(_i18n.i18n.translate('xpack.canvas.functions.pointseries.unwrappedExpressionErrorMessage', {
    defaultMessage: 'Expressions must be wrapped in a function such as {fn}',
    values: {
      fn: 'sum()'
    }
  }))
};
exports.errors = errors;