"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theme = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const theme = {
  name: 'theme',
  aliases: [],
  help: _i18n.i18n.translate('expressions.functions.themeHelpText', {
    defaultMessage: 'Reads a theme setting.'
  }),
  inputTypes: ['null'],
  args: {
    variable: {
      aliases: ['_'],
      help: _i18n.i18n.translate('expressions.functions.theme.args.variableHelpText', {
        defaultMessage: 'Name of the theme variable to read.'
      }),
      required: true,
      types: ['string']
    },
    default: {
      help: _i18n.i18n.translate('expressions.functions.theme.args.defaultHelpText', {
        defaultMessage: 'default value in case theming info is not available.'
      })
    }
  },
  fn: (input, args, handlers) => {
    // currently we use variable `theme`, but external theme service would be preferable
    const vars = handlers.variables.theme || {};
    return (0, _lodash.get)(vars, args.variable, args.default);
  }
};
exports.theme = theme;