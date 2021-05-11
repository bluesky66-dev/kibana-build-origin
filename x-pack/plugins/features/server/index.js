"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PluginSetupContract", {
  enumerable: true,
  get: function () {
    return _plugin.PluginSetupContract;
  }
});
Object.defineProperty(exports, "PluginStartContract", {
  enumerable: true,
  get: function () {
    return _plugin.PluginStartContract;
  }
});
Object.defineProperty(exports, "uiCapabilitiesRegex", {
  enumerable: true,
  get: function () {
    return _feature_schema.uiCapabilitiesRegex;
  }
});
Object.defineProperty(exports, "KibanaFeature", {
  enumerable: true,
  get: function () {
    return _common.KibanaFeature;
  }
});
Object.defineProperty(exports, "KibanaFeatureConfig", {
  enumerable: true,
  get: function () {
    return _common.KibanaFeatureConfig;
  }
});
Object.defineProperty(exports, "FeatureKibanaPrivileges", {
  enumerable: true,
  get: function () {
    return _common.FeatureKibanaPrivileges;
  }
});
Object.defineProperty(exports, "ElasticsearchFeature", {
  enumerable: true,
  get: function () {
    return _common.ElasticsearchFeature;
  }
});
Object.defineProperty(exports, "ElasticsearchFeatureConfig", {
  enumerable: true,
  get: function () {
    return _common.ElasticsearchFeatureConfig;
  }
});
Object.defineProperty(exports, "FeatureElasticsearchPrivileges", {
  enumerable: true,
  get: function () {
    return _common.FeatureElasticsearchPrivileges;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _feature_schema = require("./feature_schema");

var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// These exports are part of public Features plugin contract, any change in signature of exported
// functions or removal of exports should be considered as a breaking change. Ideally we should
// reduce number of such exports to zero and provide everything we want to expose via Setup/Start
// run-time contracts.


const plugin = initializerContext => new _plugin.FeaturesPlugin(initializerContext);

exports.plugin = plugin;