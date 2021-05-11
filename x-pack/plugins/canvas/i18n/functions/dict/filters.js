"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.filtersHelpText', {
    defaultMessage: 'Aggregates element filters from the workpad for use elsewhere, usually a data source.'
  }),
  args: {
    group: _i18n.i18n.translate('xpack.canvas.functions.filters.args.group', {
      defaultMessage: 'The name of the filter group to use.'
    }),
    ungrouped: _i18n.i18n.translate('xpack.canvas.functions.filters.args.ungrouped', {
      defaultMessage: 'Exclude filters that belong to a filter group?'
    })
  }
};
exports.help = help;