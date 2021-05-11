"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.ReportingPlugin;
  }
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _config.config;
  }
});
Object.defineProperty(exports, "PluginSetup", {
  enumerable: true,
  get: function () {
    return _types.ReportingSetupDeps;
  }
});
Object.defineProperty(exports, "PluginStart", {
  enumerable: true,
  get: function () {
    return _types.ReportingStartDeps;
  }
});
Object.defineProperty(exports, "ReportingCore", {
  enumerable: true,
  get: function () {
    return _core.ReportingCore;
  }
});
Object.defineProperty(exports, "ReportingConfig", {
  enumerable: true,
  get: function () {
    return _config2.ReportingConfig;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _config = require("./config");

var _types = require("./types");

var _core = require("./core");

var _config2 = require("./config/config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = initContext => new _plugin.ReportingPlugin(initContext);

exports.plugin = plugin;