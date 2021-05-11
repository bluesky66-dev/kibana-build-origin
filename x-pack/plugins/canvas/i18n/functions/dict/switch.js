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
  help: _i18n.i18n.translate('xpack.canvas.functions.switchHelpText', {
    defaultMessage: 'Performs conditional logic with multiple conditions. ' + 'See also {caseFn}, which builds a {case} to pass to the {switchFn} function.',
    values: {
      case: '`case`',
      caseFn: '`case`',
      switchFn: '`switch`'
    }
  }),
  args: {
    case: _i18n.i18n.translate('xpack.canvas.functions.switch.args.caseHelpText', {
      defaultMessage: 'The conditions to check.'
    }),
    default: _i18n.i18n.translate('xpack.canvas.functions.switch.args.defaultHelpText', {
      defaultMessage: 'The value returned when no conditions are met. ' + 'When unspecified and no conditions are met, the original {CONTEXT} is returned.',
      values: {
        CONTEXT: _constants.CONTEXT
      }
    })
  }
};
exports.help = help;