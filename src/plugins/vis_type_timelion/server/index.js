"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PluginSetupContract", {
  enumerable: true,
  get: function () {
    return _plugin.PluginSetupContract;
  }
});
exports.plugin = exports.config = void 0;

var _config = require("../config");

var _plugin = require("./plugin");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  schema: _config.configSchema,
  exposeToBrowser: {
    ui: true
  },
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('timelion_vis.enabled', 'vis_type_timelion.enabled'), renameFromRoot('timelion.enabled', 'vis_type_timelion.enabled'), renameFromRoot('timelion.graphiteUrls', 'vis_type_timelion.graphiteUrls'), renameFromRoot('timelion.ui.enabled', 'vis_type_timelion.ui.enabled', true)]
};
exports.config = config;

const plugin = initializerContext => new _plugin.TimelionPlugin(initializerContext);

exports.plugin = plugin;