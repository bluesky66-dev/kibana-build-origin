"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsServerPlugin = void 0;

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
class ChartsServerPlugin {
  setup(core, dependencies) {
    dependencies.expressions.registerFunction(_common.palette);
    dependencies.expressions.registerFunction(_common.systemPalette);
    core.uiSettings.register({
      [_common.COLOR_MAPPING_SETTING]: {
        name: _i18n.i18n.translate('charts.advancedSettings.visualization.colorMappingTitle', {
          defaultMessage: 'Color mapping'
        }),
        value: JSON.stringify({
          Count: '#00A69B'
        }),
        type: 'json',
        description: _i18n.i18n.translate('charts.advancedSettings.visualization.colorMappingText', {
          defaultMessage: 'Maps values to specific colors in <strong>Visualize</strong> charts and <strong>TSVB</strong>. This setting does not apply to <strong>Lens.</strong>'
        }),
        deprecation: {
          message: _i18n.i18n.translate('charts.advancedSettings.visualization.colorMappingTextDeprecation', {
            defaultMessage: 'This setting is deprecated and will not be supported as of 8.0.'
          }),
          docLinksKey: 'visualizationSettings'
        },
        category: ['visualization'],
        schema: _configSchema.schema.string()
      }
    });
    return {};
  }

  start() {
    return {};
  }

  stop() {}

}

exports.ChartsServerPlugin = ChartsServerPlugin;