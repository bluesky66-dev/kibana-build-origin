"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SecurityOssPluginSetup", {
  enumerable: true,
  get: function () {
    return _plugin.SecurityOssPluginSetup;
  }
});
exports.plugin = exports.config = void 0;

var _config = require("./config");

var _plugin = require("./plugin");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  schema: _config.ConfigSchema,
  exposeToBrowser: {
    showInsecureClusterWarning: true
  }
};
exports.config = config;

const plugin = context => new _plugin.SecurityOssPlugin(context);

exports.plugin = plugin;