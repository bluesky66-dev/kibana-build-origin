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
  help: _i18n.i18n.translate('xpack.canvas.functions.tailHelpText', {
    defaultMessage: 'Retrieves the last N rows from the end of a {DATATABLE}. See also {headFn}.',
    values: {
      DATATABLE: _constants.DATATABLE,
      headFn: '`head`'
    }
  }),
  args: {
    count: _i18n.i18n.translate('xpack.canvas.functions.tail.args.countHelpText', {
      defaultMessage: 'The number of rows to retrieve from the end of the {DATATABLE}.',
      values: {
        DATATABLE: _constants.DATATABLE
      }
    })
  }
};
exports.help = help;