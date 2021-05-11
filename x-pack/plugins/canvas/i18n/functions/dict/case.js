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


const IF_ARG = '`if`';
const WHEN_ARG = '`when`';
const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.caseHelpText', {
    defaultMessage: 'Builds a {case}, including a condition and a result, to pass to the {switchFn} function.',
    values: {
      case: '`case`',
      switchFn: '`switch`'
    }
  }),
  args: {
    when: _i18n.i18n.translate('xpack.canvas.functions.case.args.whenHelpText', {
      defaultMessage: 'The value compared to the {CONTEXT} to see if they are equal. The {WHEN_ARG} argument is ignored when the {IF_ARG} argument is also specified.',
      values: {
        CONTEXT: _constants.CONTEXT,
        IF_ARG,
        WHEN_ARG
      }
    }),
    if: _i18n.i18n.translate('xpack.canvas.functions.case.args.ifHelpText', {
      defaultMessage: 'This value indicates whether the condition is met. The {IF_ARG} argument overrides the {WHEN_ARG} argument when both are provided.',
      values: {
        IF_ARG,
        WHEN_ARG
      }
    }),
    then: _i18n.i18n.translate('xpack.canvas.functions.case.args.thenHelpText', {
      defaultMessage: 'The value returned if the condition is met.'
    })
  }
};
exports.help = help;