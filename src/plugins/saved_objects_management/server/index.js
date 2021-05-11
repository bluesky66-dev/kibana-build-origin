"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SavedObjectsManagementPluginSetup", {
  enumerable: true,
  get: function () {
    return _types.SavedObjectsManagementPluginSetup;
  }
});
Object.defineProperty(exports, "SavedObjectsManagementPluginStart", {
  enumerable: true,
  get: function () {
    return _types.SavedObjectsManagementPluginStart;
  }
});
Object.defineProperty(exports, "SavedObjectMetadata", {
  enumerable: true,
  get: function () {
    return _types.SavedObjectMetadata;
  }
});
Object.defineProperty(exports, "SavedObjectWithMetadata", {
  enumerable: true,
  get: function () {
    return _types.SavedObjectWithMetadata;
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
const plugin = context => new _plugin.SavedObjectsManagementPlugin(context);

exports.plugin = plugin;