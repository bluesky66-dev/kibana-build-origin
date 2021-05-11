"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.DashboardModeServerPlugin;
  }
});
exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  })
};
exports.config = config;

function plugin(initializerContext) {
  return new _plugin.DashboardModeServerPlugin(initializerContext);
}