"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = getUiSettings;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getUiSettings() {
  return {
    'visualization:regionmap:showWarnings': {
      name: _i18n.i18n.translate('regionMap.advancedSettings.visualization.showRegionMapWarningsTitle', {
        defaultMessage: 'Show region map warning'
      }),
      value: true,
      description: _i18n.i18n.translate('regionMap.advancedSettings.visualization.showRegionMapWarningsText', {
        defaultMessage: 'Whether the region map shows a warning when terms cannot be joined to a shape on the map.'
      }),
      schema: _configSchema.schema.boolean(),
      category: ['visualization']
    }
  };
}