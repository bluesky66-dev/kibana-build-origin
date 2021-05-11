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
  help: _i18n.i18n.translate('xpack.canvas.functions.getCellHelpText', {
    defaultMessage: 'Fetches a single cell from a {DATATABLE}.',
    values: {
      DATATABLE: _constants.DATATABLE
    }
  }),
  args: {
    column: _i18n.i18n.translate('xpack.canvas.functions.getCell.args.columnHelpText', {
      defaultMessage: 'The name of the column to fetch the value from. ' + 'If not provided, the value is retrieved from the first column.'
    }),
    row: _i18n.i18n.translate('xpack.canvas.functions.getCell.args.rowHelpText', {
      defaultMessage: 'The row number, starting at 0.'
    })
  }
};
exports.help = help;
const errors = {
  rowNotFound: row => new Error(_i18n.i18n.translate('xpack.canvas.functions.getCell.rowNotFoundErrorMessage', {
    defaultMessage: "Row not found: '{row}'",
    values: {
      row
    }
  })),
  columnNotFound: column => new Error(_i18n.i18n.translate('xpack.canvas.functions.getCell.columnNotFoundErrorMessage', {
    defaultMessage: "Column not found: '{column}'",
    values: {
      column
    }
  }))
};
exports.errors = errors;