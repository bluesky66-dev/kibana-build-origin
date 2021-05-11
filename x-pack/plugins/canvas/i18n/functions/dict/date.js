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
  help: _i18n.i18n.translate('xpack.canvas.functions.dateHelpText', {
    defaultMessage: 'Returns the current time, or a time parsed from a specified string, as milliseconds since epoch.'
  }),
  args: {
    value: _i18n.i18n.translate('xpack.canvas.functions.date.args.valueHelpText', {
      defaultMessage: 'An optional date string that is parsed into milliseconds since epoch. The date string can be either a valid ' + '{JS} {date} input or a string to parse using the {formatArg} argument. Must be an {ISO8601} ' + 'string, or you must provide the format.',
      values: {
        JS: _constants.JS,
        date: '`Date`',
        formatArg: '`format`',
        ISO8601: _constants.ISO8601
      }
    }),
    format: _i18n.i18n.translate('xpack.canvas.functions.date.args.formatHelpText', {
      defaultMessage: 'The {MOMENTJS} format used to parse the specified date string. For more information, see {url}.',
      values: {
        MOMENTJS: _constants.MOMENTJS,
        url: 'https://momentjs.com/docs/#/displaying/'
      }
    })
  }
};
exports.help = help;
const errors = {
  invalidDateInput: dateStr => new Error(_i18n.i18n.translate('xpack.canvas.functions.date.invalidDateInputErrorMessage', {
    defaultMessage: 'Invalid date input: {date}',
    values: {
      date: dateStr
    }
  }))
};
exports.errors = errors;