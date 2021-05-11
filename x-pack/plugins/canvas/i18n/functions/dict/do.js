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
  help: _i18n.i18n.translate('xpack.canvas.functions.doHelpText', {
    defaultMessage: 'Executes multiple sub-expressions, then returns the original {CONTEXT}. ' + 'Use for running functions that produce an action or a side effect without changing the original {CONTEXT}.',
    values: {
      CONTEXT: _constants.CONTEXT
    }
  }),
  args: {
    fn: _i18n.i18n.translate('xpack.canvas.functions.do.args.fnHelpText', {
      defaultMessage: 'The sub-expressions to execute. The return values of these sub-expressions are not available in the root ' + 'pipeline as this function simply returns the original {CONTEXT}.',
      values: {
        CONTEXT: _constants.CONTEXT
      }
    })
  }
};
exports.help = help;