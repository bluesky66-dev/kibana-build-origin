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
  help: _i18n.i18n.translate('xpack.canvas.functions.filterrowsHelpText', {
    defaultMessage: 'Filters rows in a {DATATABLE} based on the return value of a sub-expression.',
    values: {
      DATATABLE: _constants.DATATABLE
    }
  }),
  args: {
    fn: _i18n.i18n.translate('xpack.canvas.functions.filterrows.args.fnHelpText', {
      defaultMessage: 'An expression to pass into each row in the {DATATABLE}. ' + 'The expression should return a {TYPE_BOOLEAN}. ' + 'A {BOOLEAN_TRUE} value preserves the row, and a {BOOLEAN_FALSE} value removes it.',
      values: {
        BOOLEAN_FALSE: _constants.BOOLEAN_FALSE,
        BOOLEAN_TRUE: _constants.BOOLEAN_TRUE,
        DATATABLE: _constants.DATATABLE,
        TYPE_BOOLEAN: _constants.TYPE_BOOLEAN
      }
    })
  }
};
exports.help = help;