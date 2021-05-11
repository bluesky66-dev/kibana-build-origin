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
  help: _i18n.i18n.translate('xpack.canvas.functions.timefilterControlHelpText', {
    defaultMessage: 'Configures a time filter control element.'
  }),
  args: {
    column: _i18n.i18n.translate('xpack.canvas.functions.timefilterControl.args.columnHelpText', {
      defaultMessage: 'The column or field that you want to filter.'
    }),
    compact: _i18n.i18n.translate('xpack.canvas.functions.timefilterControl.args.compactHelpText', {
      defaultMessage: 'Shows the time filter as a button, which triggers a popover.'
    }),
    filterGroup: _i18n.i18n.translate('xpack.canvas.functions.dropdownControl.args.filterGroupHelpText', {
      defaultMessage: 'The group name for the filter.'
    })
  }
};
exports.help = help;