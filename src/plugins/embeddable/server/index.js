"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "EmbeddableSetup", {
  enumerable: true,
  get: function () {
    return _plugin.EmbeddableSetup;
  }
});
Object.defineProperty(exports, "EnhancementRegistryDefinition", {
  enumerable: true,
  get: function () {
    return _types.EnhancementRegistryDefinition;
  }
});
Object.defineProperty(exports, "EmbeddableRegistryDefinition", {
  enumerable: true,
  get: function () {
    return _types.EmbeddableRegistryDefinition;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _types = require("./types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const plugin = () => new _plugin.EmbeddableServerPlugin();

exports.plugin = plugin;