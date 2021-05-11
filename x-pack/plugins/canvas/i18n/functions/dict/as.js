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
  help: _i18n.i18n.translate('xpack.canvas.functions.asHelpText', {
    defaultMessage: 'Creates a {DATATABLE} with a single value. See also {getCellFn}.',
    values: {
      DATATABLE: _constants.DATATABLE,
      getCellFn: '`getCell`'
    }
  }),
  args: {
    name: _i18n.i18n.translate('xpack.canvas.functions.as.args.nameHelpText', {
      defaultMessage: 'The name to give the column.'
    })
  }
};
exports.help = help;