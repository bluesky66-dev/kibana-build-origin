"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMiscUiSettings = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getMiscUiSettings = () => {
  return {
    'truncate:maxHeight': {
      name: _i18n.i18n.translate('core.ui_settings.params.maxCellHeightTitle', {
        defaultMessage: 'Maximum table cell height'
      }),
      value: 115,
      description: _i18n.i18n.translate('core.ui_settings.params.maxCellHeightText', {
        defaultMessage: 'The maximum height that a cell in a table should occupy. Set to 0 to disable truncation'
      }),
      schema: _configSchema.schema.number({
        min: 0
      })
    },
    buildNum: {
      readonly: true,
      schema: _configSchema.schema.maybe(_configSchema.schema.number())
    }
  };
};

exports.getMiscUiSettings = getMiscUiSettings;