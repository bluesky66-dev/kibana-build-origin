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
  help: _i18n.i18n.translate('xpack.canvas.functions.tableHelpText', {
    defaultMessage: 'Configures a table element.'
  }),
  args: {
    font: _i18n.i18n.translate('xpack.canvas.functions.table.args.fontHelpText', {
      defaultMessage: 'The {CSS} font properties for the contents of the table. For example, {FONT_FAMILY} or {FONT_WEIGHT}.',
      values: {
        CSS: _constants.CSS,
        FONT_FAMILY: _constants.FONT_FAMILY,
        FONT_WEIGHT: _constants.FONT_WEIGHT
      }
    }),
    paginate: _i18n.i18n.translate('xpack.canvas.functions.table.args.paginateHelpText', {
      defaultMessage: 'Show pagination controls? When {BOOLEAN_FALSE}, only the first page is displayed.',
      values: {
        BOOLEAN_FALSE: _constants.BOOLEAN_FALSE
      }
    }),
    perPage: _i18n.i18n.translate('xpack.canvas.functions.table.args.perPageHelpText', {
      defaultMessage: 'The number of rows to display on each page.'
    }),
    showHeader: _i18n.i18n.translate('xpack.canvas.functions.table.args.showHeaderHelpText', {
      defaultMessage: 'Show or hide the header row with titles for each column.'
    })
  }
};
exports.help = help;