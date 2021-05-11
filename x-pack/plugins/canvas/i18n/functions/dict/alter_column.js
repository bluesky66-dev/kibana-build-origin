"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../../common/lib/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.alterColumnHelpText', {
    defaultMessage: 'Converts between core types, including {list}, and {end}, and renames columns. ' + 'See also {mapColumnFn} and {staticColumnFn}.',
    values: {
      list: Object.values(_constants.DATATABLE_COLUMN_TYPES).slice(0, -1).map(type => `\`${type}\``).join(', '),
      end: `\`${Object.values(_constants.DATATABLE_COLUMN_TYPES).slice(-1)[0]}\``,
      mapColumnFn: '`mapColumn`',
      staticColumnFn: '`staticColumn`'
    }
  }),
  args: {
    column: _i18n.i18n.translate('xpack.canvas.functions.alterColumn.args.columnHelpText', {
      defaultMessage: 'The name of the column to alter.'
    }),
    name: _i18n.i18n.translate('xpack.canvas.functions.alterColumn.args.nameHelpText', {
      defaultMessage: 'The resultant column name. Leave blank to not rename.'
    }),
    type: _i18n.i18n.translate('xpack.canvas.functions.alterColumn.args.typeHelpText', {
      defaultMessage: 'The type to convert the column to. Leave blank to not change the type.'
    })
  }
};
exports.help = help;
const errors = {
  columnNotFound: column => new Error(_i18n.i18n.translate('xpack.canvas.functions.alterColumn.columnNotFoundErrorMessage', {
    defaultMessage: "Column not found: '{column}'",
    values: {
      column
    }
  })),
  cannotConvertType: type => new Error(_i18n.i18n.translate('xpack.canvas.functions.alterColumn.cannotConvertTypeErrorMessage', {
    defaultMessage: "Cannot convert to '{type}'",
    values: {
      type
    }
  }))
};
exports.errors = errors;