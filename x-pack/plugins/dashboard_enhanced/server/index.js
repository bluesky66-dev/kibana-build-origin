"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "DashboardEnhancedSetupContract", {
  enumerable: true,
  get: function () {
    return _plugin.SetupContract;
  }
});
Object.defineProperty(exports, "DashboardEnhancedSetupDependencies", {
  enumerable: true,
  get: function () {
    return _plugin.SetupDependencies;
  }
});
Object.defineProperty(exports, "DashboardEnhancedStartContract", {
  enumerable: true,
  get: function () {
    return _plugin.StartContract;
  }
});
Object.defineProperty(exports, "DashboardEnhancedStartDependencies", {
  enumerable: true,
  get: function () {
    return _plugin.StartDependencies;
  }
});

var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function plugin(context) {
  return new _plugin.DashboardEnhancedPlugin(context);
}