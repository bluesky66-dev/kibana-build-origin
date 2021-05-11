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
Object.defineProperty(exports, "PluginStartContract", {
  enumerable: true,
  get: function () {
    return _plugin.PluginStartContract;
  }
});
Object.defineProperty(exports, "FindResult", {
  enumerable: true,
  get: function () {
    return _alerts_client.FindResult;
  }
});
Object.defineProperty(exports, "AlertInstance", {
  enumerable: true,
  get: function () {
    return _alert_instance.PublicAlertInstance;
  }
});
Object.defineProperty(exports, "parseDuration", {
  enumerable: true,
  get: function () {
    return _lib.parseDuration;
  }
});
exports.config = exports.plugin = void 0;

var _plugin = require("./plugin");

var _config = require("./config");

var _alerts_client = require("./alerts_client");

var _alert_instance = require("./alert_instance");

var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = initContext => new _plugin.AlertingPlugin(initContext);

exports.plugin = plugin;
const config = {
  schema: _config.configSchema
};
exports.config = config;