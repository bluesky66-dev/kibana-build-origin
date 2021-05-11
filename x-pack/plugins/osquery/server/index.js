"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "OsqueryPluginSetup", {
  enumerable: true,
  get: function () {
    return _types.OsqueryPluginSetup;
  }
});
Object.defineProperty(exports, "OsqueryPluginStart", {
  enumerable: true,
  get: function () {
    return _types.OsqueryPluginStart;
  }
});
exports.config = void 0;

var _plugin = require("./plugin");

var _config = require("./config");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _config.ConfigSchema,
  exposeToBrowser: {
    enabled: true
  }
};
exports.config = config;

function plugin(initializerContext) {
  return new _plugin.OsqueryPlugin(initializerContext);
}