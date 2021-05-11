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
  help: _i18n.i18n.translate('xpack.canvas.functions.mapColumnHelpText', {
    defaultMessage: 'Adds a column calculated as the result of other columns. ' + 'Changes are made only when you provide arguments.' + 'See also {alterColumnFn} and {staticColumnFn}.',
    values: {
      alterColumnFn: '`alterColumn`',
      staticColumnFn: '`staticColumn`'
    }
  }),
  args: {
    name: _i18n.i18n.translate('xpack.canvas.functions.mapColumn.args.nameHelpText', {
      defaultMessage: 'The name of the resulting column.'
    }),
    expression: _i18n.i18n.translate('xpack.canvas.functions.mapColumn.args.expressionHelpText', {
      defaultMessage: 'A {CANVAS} expression that is passed to each row as a single row {DATATABLE}.',
      values: {
        CANVAS: _constants.CANVAS,
        DATATABLE: _constants.DATATABLE
      }
    })
  }
};
exports.help = help;