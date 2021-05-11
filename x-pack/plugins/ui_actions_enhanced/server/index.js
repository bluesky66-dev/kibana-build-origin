"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.AdvancedUiActionsServerPlugin;
  }
});
Object.defineProperty(exports, "AdvancedUiActionsSetup", {
  enumerable: true,
  get: function () {
    return _plugin.SetupContract;
  }
});
Object.defineProperty(exports, "AdvancedUiActionsStart", {
  enumerable: true,
  get: function () {
    return _plugin.StartContract;
  }
});
Object.defineProperty(exports, "UiActionsEnhancedActionFactoryDefinition", {
  enumerable: true,
  get: function () {
    return _types.ActionFactoryDefinition;
  }
});
Object.defineProperty(exports, "UiActionsEnhancedActionFactory", {
  enumerable: true,
  get: function () {
    return _types.ActionFactory;
  }
});
Object.defineProperty(exports, "DynamicActionsState", {
  enumerable: true,
  get: function () {
    return _types2.DynamicActionsState;
  }
});
Object.defineProperty(exports, "UiActionsEnhancedBaseActionConfig", {
  enumerable: true,
  get: function () {
    return _types2.BaseActionConfig;
  }
});
Object.defineProperty(exports, "UiActionsEnhancedSerializedAction", {
  enumerable: true,
  get: function () {
    return _types2.SerializedAction;
  }
});
Object.defineProperty(exports, "UiActionsEnhancedSerializedEvent", {
  enumerable: true,
  get: function () {
    return _types2.SerializedEvent;
  }
});

var _plugin = require("./plugin");

var _types = require("./types");

var _types2 = require("../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function plugin() {
  return new _plugin.AdvancedUiActionsServerPlugin();
}