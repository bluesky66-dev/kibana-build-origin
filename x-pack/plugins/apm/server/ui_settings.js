"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiSettings = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _ui_settings_keys = require("../common/ui_settings_keys");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * uiSettings definitions for APM.
 */


const uiSettings = {
  [_ui_settings_keys.enableServiceOverview]: {
    category: ['observability'],
    name: _i18n.i18n.translate('xpack.apm.enableServiceOverviewExperimentName', {
      defaultMessage: 'APM Service overview'
    }),
    value: true,
    description: _i18n.i18n.translate('xpack.apm.enableServiceOverviewExperimentDescription', {
      defaultMessage: 'Enable the Overview tab for services in APM.'
    }),
    schema: _configSchema.schema.boolean()
  }
};
exports.uiSettings = uiSettings;