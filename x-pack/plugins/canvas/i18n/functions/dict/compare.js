"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _compare = require("../../../canvas_plugin_src/functions/common/compare");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.compareHelpText', {
    defaultMessage: 'Compares the {CONTEXT} to specified value to determine {BOOLEAN_TRUE} or {BOOLEAN_FALSE}. Usually used in combination with `{ifFn}` or `{caseFn}`. ' + 'This only works with primitive types, such as {examples}. See also {eqFn}, {gtFn}, {gteFn}, {ltFn}, {lteFn}, {neqFn}',
    values: {
      CONTEXT: _constants.CONTEXT,
      BOOLEAN_TRUE: _constants.BOOLEAN_TRUE,
      BOOLEAN_FALSE: _constants.BOOLEAN_FALSE,
      ifFn: '`if`',
      caseFn: 'case',
      examples: [_constants.TYPE_NUMBER, _constants.TYPE_STRING, _constants.TYPE_BOOLEAN, _constants.TYPE_NULL].join(', '),
      eqFn: '`eq`',
      gtFn: '`gt`',
      gteFn: '`gte`',
      ltFn: '`lt`',
      lteFn: '`lte`',
      neqFn: '`neq`'
    }
  }),
  args: {
    op: _i18n.i18n.translate('xpack.canvas.functions.compare.args.opHelpText', {
      defaultMessage: 'The operator to use in the comparison: {eq} (equal to), {gt} (greater than), {gte} (greater than or equal to)' + ', {lt} (less than), {lte} (less than or equal to), {ne} or {neq} (not equal to).',
      values: {
        eq: `\`"${_compare.Operation.EQ}"\``,
        gt: `\`"${_compare.Operation.GT}"\``,
        gte: `\`"${_compare.Operation.GTE}"\``,
        lt: `\`"${_compare.Operation.LT}"\``,
        lte: `\`"${_compare.Operation.LTE}"\``,
        ne: `\`"${_compare.Operation.NE}"\``,
        neq: `\`"${_compare.Operation.NEQ}"\``
      }
    }),
    to: _i18n.i18n.translate('xpack.canvas.functions.compare.args.toHelpText', {
      defaultMessage: 'The value compared to the {CONTEXT}.',
      values: {
        CONTEXT: _constants.CONTEXT
      }
    })
  }
};
exports.help = help;
const errors = {
  invalidCompareOperator: (op, ops) => new Error(_i18n.i18n.translate('xpack.canvas.functions.compare.invalidCompareOperatorErrorMessage', {
    defaultMessage: "Invalid compare operator: '{op}'. Use {ops}",
    values: {
      op,
      ops
    }
  }))
};
exports.errors = errors;