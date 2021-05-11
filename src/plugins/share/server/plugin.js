"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharePlugin = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _create_routes = require("./routes/create_routes");

var _saved_objects = require("./saved_objects");

var _constants = require("../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class SharePlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;
  }

  setup(core) {
    (0, _create_routes.createRoutes)(core, this.initializerContext.logger.get());
    core.savedObjects.registerType(_saved_objects.url);
    core.uiSettings.register({
      [_constants.CSV_SEPARATOR_SETTING]: {
        name: _i18n.i18n.translate('share.advancedSettings.csv.separatorTitle', {
          defaultMessage: 'CSV separator'
        }),
        value: ',',
        description: _i18n.i18n.translate('share.advancedSettings.csv.separatorText', {
          defaultMessage: 'Separate exported values with this string'
        }),
        schema: _configSchema.schema.string()
      },
      [_constants.CSV_QUOTE_VALUES_SETTING]: {
        name: _i18n.i18n.translate('share.advancedSettings.csv.quoteValuesTitle', {
          defaultMessage: 'Quote CSV values'
        }),
        value: true,
        description: _i18n.i18n.translate('share.advancedSettings.csv.quoteValuesText', {
          defaultMessage: 'Should values be quoted in csv exports?'
        }),
        schema: _configSchema.schema.boolean()
      }
    });
  }

  start() {
    this.initializerContext.logger.get().debug('Starting plugin');
  }

  stop() {
    this.initializerContext.logger.get().debug('Stopping plugin');
  }

}

exports.SharePlugin = SharePlugin;