"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThemeSettings = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getThemeSettings = () => {
  return {
    'theme:darkMode': {
      name: _i18n.i18n.translate('core.ui_settings.params.darkModeTitle', {
        defaultMessage: 'Dark mode'
      }),
      value: false,
      description: _i18n.i18n.translate('core.ui_settings.params.darkModeText', {
        defaultMessage: `Enable a dark mode for the Kibana UI. A page refresh is required for the setting to be applied.`
      }),
      requiresPageReload: true,
      schema: _configSchema.schema.boolean()
    },
    'theme:version': {
      name: _i18n.i18n.translate('core.ui_settings.params.themeVersionTitle', {
        defaultMessage: 'Theme version'
      }),
      value: 'v7',
      type: 'select',
      options: ['v7', 'v8 (beta)'],
      description: _i18n.i18n.translate('core.ui_settings.params.themeVersionText', {
        defaultMessage: `Switch between the theme used for the current and next version of Kibana. A page refresh is required for the setting to be applied.`
      }),
      requiresPageReload: true,
      schema: _configSchema.schema.oneOf([_configSchema.schema.literal('v7'), _configSchema.schema.literal('v8 (beta)')])
    }
  };
};

exports.getThemeSettings = getThemeSettings;