"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "TelemetryCollectionManagerPluginSetup", {
  enumerable: true,
  get: function () {
    return _types.TelemetryCollectionManagerPluginSetup;
  }
});
Object.defineProperty(exports, "TelemetryCollectionManagerPluginStart", {
  enumerable: true,
  get: function () {
    return _types.TelemetryCollectionManagerPluginStart;
  }
});
Object.defineProperty(exports, "StatsCollectionConfig", {
  enumerable: true,
  get: function () {
    return _types.StatsCollectionConfig;
  }
});
Object.defineProperty(exports, "StatsGetter", {
  enumerable: true,
  get: function () {
    return _types.StatsGetter;
  }
});
Object.defineProperty(exports, "StatsGetterConfig", {
  enumerable: true,
  get: function () {
    return _types.StatsGetterConfig;
  }
});
Object.defineProperty(exports, "StatsCollectionContext", {
  enumerable: true,
  get: function () {
    return _types.StatsCollectionContext;
  }
});
Object.defineProperty(exports, "ClusterDetails", {
  enumerable: true,
  get: function () {
    return _types.ClusterDetails;
  }
});
Object.defineProperty(exports, "ClusterDetailsGetter", {
  enumerable: true,
  get: function () {
    return _types.ClusterDetailsGetter;
  }
});
Object.defineProperty(exports, "UsageStatsPayload", {
  enumerable: true,
  get: function () {
    return _types.UsageStatsPayload;
  }
});

var _plugin = require("./plugin");

var _types = require("./types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.
function plugin(initializerContext) {
  return new _plugin.TelemetryCollectionManagerPlugin(initializerContext);
}