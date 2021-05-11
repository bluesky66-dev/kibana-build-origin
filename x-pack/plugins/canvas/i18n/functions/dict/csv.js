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
  help: _i18n.i18n.translate('xpack.canvas.functions.csvHelpText', {
    defaultMessage: 'Creates a {DATATABLE} from {CSV} input.',
    values: {
      DATATABLE: _constants.DATATABLE,
      CSV: _constants.CSV
    }
  }),
  args: {
    data: _i18n.i18n.translate('xpack.canvas.functions.csv.args.dataHelpText', {
      defaultMessage: 'The {CSV} data to use.',
      values: {
        CSV: _constants.CSV
      }
    }),
    delimiter: _i18n.i18n.translate('xpack.canvas.functions.csv.args.delimeterHelpText', {
      defaultMessage: 'The data separation character.'
    }),
    newline: _i18n.i18n.translate('xpack.canvas.functions.csv.args.newlineHelpText', {
      defaultMessage: 'The row separation character.'
    })
  }
};
exports.help = help;
const errors = {
  invalidInputCSV: () => new Error(_i18n.i18n.translate('xpack.canvas.functions.csv.invalidInputCSVErrorMessage', {
    defaultMessage: 'Error parsing input CSV.'
  }))
};
exports.errors = errors;