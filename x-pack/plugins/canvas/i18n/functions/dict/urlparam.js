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
  help: _i18n.i18n.translate('xpack.canvas.functions.urlparamHelpText', {
    defaultMessage: 'Retrieves a {URL} parameter to use in an expression. ' + 'The {urlparamFn} function always returns a {TYPE_STRING}. ' + 'For example, you can retrieve the value {value} from the parameter {myVar} from the {URL} {example}.',
    values: {
      example: '`https://localhost:5601/app/canvas?myVar=20`',
      myVar: '`myVar`',
      TYPE_STRING: _constants.TYPE_STRING,
      URL: _constants.URL,
      urlparamFn: '`urlparam`',
      value: '`"20"`'
    }
  }),
  args: {
    param: _i18n.i18n.translate('xpack.canvas.functions.urlparam.args.paramHelpText', {
      defaultMessage: 'The {URL} hash parameter to retrieve.',
      values: {
        URL: _constants.URL
      }
    }),
    default: _i18n.i18n.translate('xpack.canvas.functions.urlparam.args.defaultHelpText', {
      defaultMessage: 'The string returned when the {URL} parameter is unspecified.',
      values: {
        URL: _constants.URL
      }
    })
  }
};
exports.help = help;