"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "IndexManagementPluginSetup", {
  enumerable: true,
  get: function () {
    return _plugin.IndexManagementPluginSetup;
  }
});
Object.defineProperty(exports, "IndexManagementConfig", {
  enumerable: true,
  get: function () {
    return _config.IndexManagementConfig;
  }
});
Object.defineProperty(exports, "Dependencies", {
  enumerable: true,
  get: function () {
    return _types.Dependencies;
  }
});
Object.defineProperty(exports, "Index", {
  enumerable: true,
  get: function () {
    return _common.Index;
  }
});
Object.defineProperty(exports, "LegacyTemplateSerialized", {
  enumerable: true,
  get: function () {
    return _common.LegacyTemplateSerialized;
  }
});
exports.config = exports.plugin = void 0;

var _plugin = require("./plugin");

var _config = require("./config");

var _types = require("./types");

var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = ctx => new _plugin.IndexMgmtServerPlugin(ctx);

exports.plugin = plugin;
const config = {
  schema: _config.configSchema
};
/** @public */

exports.config = config;