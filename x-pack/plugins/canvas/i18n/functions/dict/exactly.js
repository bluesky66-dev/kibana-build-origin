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
  help: _i18n.i18n.translate('xpack.canvas.functions.exactlyHelpText', {
    defaultMessage: 'Creates a filter that matches a given column to an exact value.'
  }),
  args: {
    column: _i18n.i18n.translate('xpack.canvas.functions.exactly.args.columnHelpText', {
      defaultMessage: 'The column or field that you want to filter.'
    }),
    value: _i18n.i18n.translate('xpack.canvas.functions.exactly.args.valueHelpText', {
      defaultMessage: 'The value to match exactly, including white space and capitalization.'
    }),
    filterGroup: _i18n.i18n.translate('xpack.canvas.functions.exactly.args.filterGroupHelpText', {
      defaultMessage: 'The group name for the filter.'
    })
  }
};
exports.help = help;