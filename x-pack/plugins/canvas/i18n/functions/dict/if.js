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
  help: _i18n.i18n.translate('xpack.canvas.functions.ifHelpText', {
    defaultMessage: 'Performs conditional logic.'
  }),
  args: {
    condition: _i18n.i18n.translate('xpack.canvas.functions.if.args.conditionHelpText', {
      defaultMessage: 'A {BOOLEAN_TRUE} or {BOOLEAN_FALSE} indicating whether a condition is met, ' + 'usually returned by a sub-expression. When unspecified, the original {CONTEXT} is returned.',
      values: {
        BOOLEAN_TRUE: _constants.BOOLEAN_TRUE,
        BOOLEAN_FALSE: _constants.BOOLEAN_FALSE,
        CONTEXT: _constants.CONTEXT
      }
    }),
    then: _i18n.i18n.translate('xpack.canvas.functions.if.args.thenHelpText', {
      defaultMessage: 'The return value when the condition is {BOOLEAN_TRUE}. ' + 'When unspecified and the condition is met, the original {CONTEXT} is returned.',
      values: {
        BOOLEAN_TRUE: _constants.BOOLEAN_TRUE,
        CONTEXT: _constants.CONTEXT
      }
    }),
    else: _i18n.i18n.translate('xpack.canvas.functions.if.args.elseHelpText', {
      defaultMessage: 'The return value when the condition is {BOOLEAN_FALSE}. ' + 'When unspecified and the condition is not met, the original {CONTEXT} is returned.',
      values: {
        BOOLEAN_FALSE: _constants.BOOLEAN_FALSE,
        CONTEXT: _constants.CONTEXT
      }
    })
  }
};
exports.help = help;