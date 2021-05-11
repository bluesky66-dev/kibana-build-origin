"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CaseRequestContext", {
  enumerable: true,
  get: function () {
    return _types.CaseRequestContext;
  }
});
exports.plugin = exports.config = void 0;

var _config = require("./config");

var _plugin = require("./plugin");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _config.ConfigSchema
};
exports.config = config;

const plugin = initializerContext => new _plugin.CasePlugin(initializerContext);

exports.plugin = plugin;