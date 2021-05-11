"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNavigationSettings = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _std = require("@kbn/std");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getNavigationSettings = () => {
  return {
    defaultRoute: {
      name: _i18n.i18n.translate('core.ui_settings.params.defaultRoute.defaultRouteTitle', {
        defaultMessage: 'Default route'
      }),
      value: '/app/home',
      schema: _configSchema.schema.string({
        validate(value) {
          if (!value.startsWith('/') || !(0, _std.isRelativeUrl)(value)) {
            return _i18n.i18n.translate('core.ui_settings.params.defaultRoute.defaultRouteIsRelativeValidationMessage', {
              defaultMessage: 'Must be a relative URL.'
            });
          }
        }

      }),
      description: _i18n.i18n.translate('core.ui_settings.params.defaultRoute.defaultRouteText', {
        defaultMessage: 'This setting specifies the default route when opening Kibana. ' + 'You can use this setting to modify the landing page when opening Kibana. ' + 'The route must be a relative URL.'
      })
    }
  };
};

exports.getNavigationSettings = getNavigationSettings;