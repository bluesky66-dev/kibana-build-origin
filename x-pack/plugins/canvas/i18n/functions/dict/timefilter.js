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
  help: _i18n.i18n.translate('xpack.canvas.functions.timefilterHelpText', {
    defaultMessage: 'Creates a time filter for querying a source.'
  }),
  args: {
    column: _i18n.i18n.translate('xpack.canvas.functions.timefilter.args.columnHelpText', {
      defaultMessage: 'The column or field that you want to filter.'
    }),
    from: _i18n.i18n.translate('xpack.canvas.functions.timefilter.args.fromHelpText', {
      defaultMessage: 'The beginning of the range, in {ISO8601} or {ELASTICSEARCH} {DATEMATH} format',
      values: {
        DATEMATH: _constants.DATEMATH,
        ELASTICSEARCH: _constants.ELASTICSEARCH,
        ISO8601: _constants.ISO8601
      }
    }),
    to: _i18n.i18n.translate('xpack.canvas.functions.timefilter.args.toHelpText', {
      defaultMessage: 'The end of the range, in {ISO8601} or {ELASTICSEARCH} {DATEMATH} format',
      values: {
        DATEMATH: _constants.DATEMATH,
        ELASTICSEARCH: _constants.ELASTICSEARCH,
        ISO8601: _constants.ISO8601
      }
    }),
    filterGroup: _i18n.i18n.translate('xpack.canvas.functions.timefilter.args.filterGroupHelpText', {
      defaultMessage: 'The group name for the filter.'
    })
  }
};
exports.help = help;
const errors = {
  invalidString: str => new Error(_i18n.i18n.translate('xpack.canvas.functions.timefilter.invalidStringErrorMessage', {
    defaultMessage: "Invalid date/time string: '{str}'",
    values: {
      str
    }
  }))
};
exports.errors = errors;