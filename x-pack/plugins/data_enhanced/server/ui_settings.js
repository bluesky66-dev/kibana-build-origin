"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = getUiSettings;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../src/plugins/data/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getUiSettings() {
  return {
    [_server.UI_SETTINGS.SEARCH_TIMEOUT]: {
      name: _i18n.i18n.translate('xpack.data.advancedSettings.searchTimeout', {
        defaultMessage: 'Search Timeout'
      }),
      value: 600000,
      description: _i18n.i18n.translate('xpack.data.advancedSettings.searchTimeoutDesc', {
        defaultMessage: 'Change the maximum timeout for a search session or set to 0 to disable the timeout and allow queries to run to completion.'
      }),
      type: 'number',
      category: ['search'],
      schema: _configSchema.schema.number()
    }
  };
}