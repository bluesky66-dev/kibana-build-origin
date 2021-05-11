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
  help: _i18n.i18n.translate('xpack.canvas.functions.rounddateHelpText', {
    defaultMessage: 'Uses a {MOMENTJS} formatting string to round milliseconds since epoch, and returns milliseconds since epoch.',
    values: {
      MOMENTJS: _constants.MOMENTJS
    }
  }),
  args: {
    format: _i18n.i18n.translate('xpack.canvas.functions.rounddate.args.formatHelpText', {
      defaultMessage: 'The {MOMENTJS} format to use for bucketing. For example, {example} rounds to months. See {url}.',
      values: {
        example: '`"YYYY-MM"`',
        MOMENTJS: _constants.MOMENTJS,
        url: 'https://momentjs.com/docs/#/displaying/'
      }
    })
  }
};
exports.help = help;