"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisTypeXyServerPlugin = exports.uiSettingsConfig = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const uiSettingsConfig = {
  // TODO: Remove this when vis_type_vislib is removed
  // https://github.com/elastic/kibana/issues/56143
  [_common.LEGACY_CHARTS_LIBRARY]: {
    name: _i18n.i18n.translate('visTypeXy.advancedSettings.visualization.legacyChartsLibrary.name', {
      defaultMessage: 'Legacy charts library'
    }),
    requiresPageReload: true,
    value: false,
    description: _i18n.i18n.translate('visTypeXy.advancedSettings.visualization.legacyChartsLibrary.description', {
      defaultMessage: 'Enables legacy charts library for area, line and bar charts in visualize.'
    }),
    category: ['visualization'],
    schema: _configSchema.schema.boolean()
  }
};
exports.uiSettingsConfig = uiSettingsConfig;

class VisTypeXyServerPlugin {
  setup(core) {
    core.uiSettings.register(uiSettingsConfig);
    return {};
  }

  start() {
    return {};
  }

}

exports.VisTypeXyServerPlugin = VisTypeXyServerPlugin;