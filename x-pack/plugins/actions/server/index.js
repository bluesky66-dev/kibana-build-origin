"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "asSavedObjectExecutionSource", {
  enumerable: true,
  get: function () {
    return _lib.asSavedObjectExecutionSource;
  }
});
Object.defineProperty(exports, "asHttpRequestExecutionSource", {
  enumerable: true,
  get: function () {
    return _lib.asHttpRequestExecutionSource;
  }
});
exports.config = exports.plugin = void 0;

var _plugin = require("./plugin");

var _config = require("./config");

var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = initContext => new _plugin.ActionsPlugin(initContext);

exports.plugin = plugin;
const config = {
  schema: _config.configSchema,
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('xpack.actions.whitelistedHosts', 'xpack.actions.allowedHosts')]
};
exports.config = config;