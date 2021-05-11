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
  help: _i18n.i18n.translate('xpack.canvas.functions.columnsHelpText', {
    defaultMessage: 'Includes or excludes columns from a {DATATABLE}. ' + 'When both arguments are specified, the excluded columns will be removed first.',
    values: {
      DATATABLE: _constants.DATATABLE
    }
  }),
  args: {
    include: _i18n.i18n.translate('xpack.canvas.functions.columns.args.includeHelpText', {
      defaultMessage: 'A comma-separated list of column names to keep in the {DATATABLE}.',
      values: {
        DATATABLE: _constants.DATATABLE
      }
    }),
    exclude: _i18n.i18n.translate('xpack.canvas.functions.columns.args.excludeHelpText', {
      defaultMessage: 'A comma-separated list of column names to remove from the {DATATABLE}.',
      values: {
        DATATABLE: _constants.DATATABLE
      }
    })
  }
};
exports.help = help;