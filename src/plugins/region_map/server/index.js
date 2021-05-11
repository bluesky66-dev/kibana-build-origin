"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = void 0;

var _config = require("../../maps_legacy/config");

var _ui_settings = require("./ui_settings");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  exposeToBrowser: {
    includeElasticMapsService: true,
    layers: true
  },
  schema: _config.regionmapConfigSchema
};
exports.config = config;

const plugin = () => ({
  setup(core) {
    core.uiSettings.register((0, _ui_settings.getUiSettings)());
  },

  start() {}

});

exports.plugin = plugin;