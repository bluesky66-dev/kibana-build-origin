"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ConsoleSetup", {
  enumerable: true,
  get: function () {
    return _types.ConsoleSetup;
  }
});
Object.defineProperty(exports, "ConsoleStart", {
  enumerable: true,
  get: function () {
    return _types.ConsoleStart;
  }
});
exports.config = exports.plugin = void 0;

var _config = require("./config");

var _plugin = require("./plugin");

var _types = require("./types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const plugin = ctx => new _plugin.ConsoleServerPlugin(ctx);

exports.plugin = plugin;
const config = {
  deprecations: ({
    unused
  }) => [unused('ssl')],
  schema: _config.config
};
exports.config = config;