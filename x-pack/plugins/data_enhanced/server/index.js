"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.EnhancedDataServerPlugin;
  }
});
Object.defineProperty(exports, "ENHANCED_ES_SEARCH_STRATEGY", {
  enumerable: true,
  get: function () {
    return _common.ENHANCED_ES_SEARCH_STRATEGY;
  }
});
Object.defineProperty(exports, "EQL_SEARCH_STRATEGY", {
  enumerable: true,
  get: function () {
    return _common.EQL_SEARCH_STRATEGY;
  }
});
exports.config = void 0;

var _plugin = require("./plugin");

var _config = require("../config");

var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  exposeToBrowser: {
    search: true
  },
  schema: _config.configSchema
};
exports.config = config;

function plugin(initializerContext) {
  return new _plugin.EnhancedDataServerPlugin(initializerContext);
}