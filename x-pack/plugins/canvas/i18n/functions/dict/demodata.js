"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _demo_rows_types = require("../../../canvas_plugin_src/functions/server/demodata/demo_rows_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.demodataHelpText', {
    defaultMessage: 'A sample data set that includes project {ci} times with usernames, countries, and run phases.',
    values: {
      ci: 'CI'
    }
  }),
  args: {
    type: _i18n.i18n.translate('xpack.canvas.functions.demodata.args.typeHelpText', {
      defaultMessage: 'The name of the demo data set to use.'
    })
  }
};
exports.help = help;
const errors = {
  invalidDataSet: arg => new Error(_i18n.i18n.translate('xpack.canvas.functions.demodata.invalidDataSetErrorMessage', {
    defaultMessage: "Invalid data set: '{arg}', use '{ci}' or '{shirts}'.",
    values: {
      arg,
      ci: _demo_rows_types.DemoRows.CI,
      shirts: _demo_rows_types.DemoRows.SHIRTS
    }
  }))
};
exports.errors = errors;