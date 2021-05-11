"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "DashboardPluginSetup", {
  enumerable: true,
  get: function () {
    return _types.DashboardPluginSetup;
  }
});
Object.defineProperty(exports, "DashboardPluginStart", {
  enumerable: true,
  get: function () {
    return _types.DashboardPluginStart;
  }
});
Object.defineProperty(exports, "findByValueEmbeddables", {
  enumerable: true,
  get: function () {
    return _find_by_value_embeddables.findByValueEmbeddables;
  }
});
exports.config = void 0;

var _plugin = require("./plugin");

var _config = require("../config");

var _types = require("./types");

var _find_by_value_embeddables = require("./usage/find_by_value_embeddables");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  exposeToBrowser: {
    allowByValueEmbeddables: true
  },
  schema: _config.configSchema
}; //  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

exports.config = config;

function plugin(initializerContext) {
  return new _plugin.DashboardPlugin(initializerContext);
}