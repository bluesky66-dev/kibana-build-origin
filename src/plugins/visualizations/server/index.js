"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "VISUALIZE_ENABLE_LABS_SETTING", {
  enumerable: true,
  get: function () {
    return _constants.VISUALIZE_ENABLE_LABS_SETTING;
  }
});
Object.defineProperty(exports, "VisualizationsPluginSetup", {
  enumerable: true,
  get: function () {
    return _types.VisualizationsPluginSetup;
  }
});
Object.defineProperty(exports, "VisualizationsPluginStart", {
  enumerable: true,
  get: function () {
    return _types.VisualizationsPluginStart;
  }
});

var _plugin = require("./plugin");

var _constants = require("../common/constants");

var _types = require("./types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.
function plugin(initializerContext) {
  return new _plugin.VisualizationsPlugin(initializerContext);
}