"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "VisTypeVegaPluginStart", {
  enumerable: true,
  get: function () {
    return _types.VisTypeVegaPluginStart;
  }
});
Object.defineProperty(exports, "VisTypeVegaPluginSetup", {
  enumerable: true,
  get: function () {
    return _types.VisTypeVegaPluginSetup;
  }
});
exports.config = void 0;

var _config = require("../config");

var _plugin = require("./plugin");

var _types = require("./types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  exposeToBrowser: {
    enableExternalUrls: true
  },
  schema: _config.configSchema,
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('vega.enableExternalUrls', 'vis_type_vega.enableExternalUrls'), renameFromRoot('vega.enabled', 'vis_type_vega.enabled')]
};
exports.config = config;

function plugin(initializerContext) {
  return new _plugin.VisTypeVegaPlugin(initializerContext);
}