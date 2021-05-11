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
  help: _i18n.i18n.translate('xpack.canvas.functions.anyHelpText', {
    defaultMessage: 'Returns {BOOLEAN_TRUE} if at least one of the conditions is met. See also {all_fn}.',
    values: {
      all_fn: '`all`',
      BOOLEAN_TRUE: _constants.BOOLEAN_TRUE
    }
  }),
  args: {
    condition: _i18n.i18n.translate('xpack.canvas.functions.any.args.conditionHelpText', {
      defaultMessage: 'The conditions to check.'
    })
  }
};
exports.help = help;