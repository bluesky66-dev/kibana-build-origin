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
  help: _i18n.i18n.translate('xpack.canvas.functions.plyHelpText', {
    defaultMessage: 'Subdivides a {DATATABLE} by the unique values of the specified columns, ' + 'and passes the resulting tables into an expression, then merges the outputs of each expression.',
    values: {
      DATATABLE: _constants.DATATABLE
    }
  }),
  args: {
    by: _i18n.i18n.translate('xpack.canvas.functions.ply.args.byHelpText', {
      defaultMessage: 'The column to subdivide the {DATATABLE}.',
      values: {
        DATATABLE: _constants.DATATABLE
      }
    }),
    expression: _i18n.i18n.translate('xpack.canvas.functions.ply.args.expressionHelpText', {
      defaultMessage: 'An expression to pass each resulting {DATATABLE} into. ' + 'Tips: Expressions must return a {DATATABLE}. Use {asFn} to turn literals into {DATATABLE}s. ' + 'Multiple expressions must return the same number of rows.' + 'If you need to return a different row count, pipe into another instance of {plyFn}. ' + 'If multiple expressions returns the columns with the same name, the last one wins.',
      values: {
        asFn: '`as`',
        DATATABLE: _constants.DATATABLE,
        plyFn: '`ply`'
      }
    })
  }
};
exports.help = help;
const errors = {
  columnNotFound: by => new Error(_i18n.i18n.translate('xpack.canvas.functions.ply.columnNotFoundErrorMessage', {
    defaultMessage: "Column not found: '{by}'",
    values: {
      by
    }
  })),
  rowCountMismatch: () => new Error(_i18n.i18n.translate('xpack.canvas.functions.ply.rowCountMismatchErrorMessage', {
    defaultMessage: 'All expressions must return the same number of rows'
  }))
};
exports.errors = errors;