"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAccessibilitySettings = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getAccessibilitySettings = () => {
  return {
    'accessibility:disableAnimations': {
      name: _i18n.i18n.translate('core.ui_settings.params.disableAnimationsTitle', {
        defaultMessage: 'Disable Animations'
      }),
      value: false,
      description: _i18n.i18n.translate('core.ui_settings.params.disableAnimationsText', {
        defaultMessage: 'Turn off all unnecessary animations in the Kibana UI. Refresh the page to apply the changes.'
      }),
      category: ['accessibility'],
      requiresPageReload: true,
      schema: _configSchema.schema.boolean()
    }
  };
};

exports.getAccessibilitySettings = getAccessibilitySettings;