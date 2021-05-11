"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MonitoringConfig", {
  enumerable: true,
  get: function () {
    return _config.MonitoringConfig;
  }
});
Object.defineProperty(exports, "KibanaSettingsCollector", {
  enumerable: true,
  get: function () {
    return _collectors.KibanaSettingsCollector;
  }
});
Object.defineProperty(exports, "MonitoringPluginSetup", {
  enumerable: true,
  get: function () {
    return _types.MonitoringPluginSetup;
  }
});
Object.defineProperty(exports, "IBulkUploader", {
  enumerable: true,
  get: function () {
    return _types.IBulkUploader;
  }
});
exports.config = exports.plugin = void 0;

var _plugin = require("./plugin");

var _config = require("./config");

var _deprecations = require("./deprecations");

var _collectors = require("./kibana_monitoring/collectors");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = initContext => new _plugin.MonitoringPlugin(initContext);

exports.plugin = plugin;
const config = {
  schema: _config.configSchema,
  deprecations: _deprecations.deprecations,
  exposeToBrowser: {
    enabled: true,
    ui: true,
    kibana: true
  }
};
exports.config = config;