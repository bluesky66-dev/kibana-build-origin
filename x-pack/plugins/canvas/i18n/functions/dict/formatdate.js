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
  help: _i18n.i18n.translate('xpack.canvas.functions.formatdateHelpText', {
    defaultMessage: 'Formats an {ISO8601} date string or a date in milliseconds since epoch using {MOMENTJS}. See {url}.',
    values: {
      ISO8601: _constants.ISO8601,
      MOMENTJS: _constants.MOMENTJS,
      url: 'https://momentjs.com/docs/#/displaying/'
    }
  }),
  args: {
    format: _i18n.i18n.translate('xpack.canvas.functions.formatdate.args.formatHelpText', {
      defaultMessage: 'A {MOMENTJS} format. For example, {example}. See {url}.',
      values: {
        MOMENTJS: _constants.MOMENTJS,
        example: '`"MM/DD/YYYY"`',
        url: 'https://momentjs.com/docs/#/displaying/'
      }
    })
  }
};
exports.help = help;