"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  config: true,
  plugin: true
};
exports.plugin = exports.config = void 0;

var _plugin = require("./plugin");

Object.keys(_plugin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _plugin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _plugin[key];
    }
  });
});

var _config = require("../config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _config.configSchema
};
exports.config = config;

const plugin = initializerContext => new _plugin.LensServerPlugin(initializerContext);

exports.plugin = plugin;