"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiscoverServerPlugin = void 0;

var _ui_settings = require("./ui_settings");

var _capabilities_provider = require("./capabilities_provider");

var _saved_objects = require("./saved_objects");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class DiscoverServerPlugin {
  setup(core) {
    core.capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
    core.uiSettings.register(_ui_settings.uiSettings);
    core.savedObjects.registerType(_saved_objects.searchSavedObjectType);
    return {};
  }

  start(core) {
    return {};
  }

  stop() {}

}

exports.DiscoverServerPlugin = DiscoverServerPlugin;