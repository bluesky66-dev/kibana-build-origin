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
  help: _i18n.i18n.translate('xpack.canvas.functions.formatnumberHelpText', {
    defaultMessage: 'Formats a number into a formatted number string using the {NUMERALJS}.',
    values: {
      NUMERALJS: _constants.NUMERALJS
    }
  }),
  args: {
    // TODO: Find a way to generate the docs URL here
    format: _i18n.i18n.translate('xpack.canvas.functions.formatnumber.args.formatHelpText', {
      defaultMessage: 'A {NUMERALJS} format string. For example, {example1} or {example2}.',
      values: {
        example1: '`"0.0a"`',
        example2: '`"0%"`',
        NUMERALJS: _constants.NUMERALJS
      }
    })
  }
};
exports.help = help;