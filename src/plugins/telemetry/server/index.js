"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TelemetryPluginSetup", {
  enumerable: true,
  get: function () {
    return _plugin.TelemetryPluginSetup;
  }
});
Object.defineProperty(exports, "TelemetryPluginStart", {
  enumerable: true,
  get: function () {
    return _plugin.TelemetryPluginStart;
  }
});
Object.defineProperty(exports, "FetcherTask", {
  enumerable: true,
  get: function () {
    return _fetcher.FetcherTask;
  }
});
Object.defineProperty(exports, "handleOldSettings", {
  enumerable: true,
  get: function () {
    return _handle_old_settings.handleOldSettings;
  }
});
Object.defineProperty(exports, "getClusterUuids", {
  enumerable: true,
  get: function () {
    return _telemetry_collection.getClusterUuids;
  }
});
Object.defineProperty(exports, "getLocalStats", {
  enumerable: true,
  get: function () {
    return _telemetry_collection.getLocalStats;
  }
});
Object.defineProperty(exports, "TelemetryLocalStats", {
  enumerable: true,
  get: function () {
    return _telemetry_collection.TelemetryLocalStats;
  }
});
Object.defineProperty(exports, "DATA_TELEMETRY_ID", {
  enumerable: true,
  get: function () {
    return _telemetry_collection.DATA_TELEMETRY_ID;
  }
});
Object.defineProperty(exports, "DataTelemetryIndex", {
  enumerable: true,
  get: function () {
    return _telemetry_collection.DataTelemetryIndex;
  }
});
Object.defineProperty(exports, "DataTelemetryPayload", {
  enumerable: true,
  get: function () {
    return _telemetry_collection.DataTelemetryPayload;
  }
});
Object.defineProperty(exports, "buildDataTelemetryPayload", {
  enumerable: true,
  get: function () {
    return _telemetry_collection.buildDataTelemetryPayload;
  }
});
exports.constants = exports.plugin = exports.config = void 0;

var _plugin = require("./plugin");

var constants = _interopRequireWildcard(require("../common/constants"));

exports.constants = constants;

var _config = require("./config");

var _fetcher = require("./fetcher");

var _handle_old_settings = require("./handle_old_settings");

var _telemetry_collection = require("./telemetry_collection");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  schema: _config.configSchema,
  exposeToBrowser: {
    enabled: true,
    url: true,
    banner: true,
    allowChangingOptInStatus: true,
    optIn: true,
    optInStatusUrl: true,
    sendUsageFrom: true
  }
};
exports.config = config;

const plugin = initializerContext => new _plugin.TelemetryPlugin(initializerContext);

exports.plugin = plugin;