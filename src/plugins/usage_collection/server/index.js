"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "UsageCollectionSetup", {
  enumerable: true,
  get: function () {
    return _plugin.UsageCollectionSetup;
  }
});
Object.defineProperty(exports, "AllowedSchemaTypes", {
  enumerable: true,
  get: function () {
    return _collector.AllowedSchemaTypes;
  }
});
Object.defineProperty(exports, "MakeSchemaFrom", {
  enumerable: true,
  get: function () {
    return _collector.MakeSchemaFrom;
  }
});
Object.defineProperty(exports, "SchemaField", {
  enumerable: true,
  get: function () {
    return _collector.SchemaField;
  }
});
Object.defineProperty(exports, "CollectorOptions", {
  enumerable: true,
  get: function () {
    return _collector.CollectorOptions;
  }
});
Object.defineProperty(exports, "UsageCollectorOptions", {
  enumerable: true,
  get: function () {
    return _collector.UsageCollectorOptions;
  }
});
Object.defineProperty(exports, "Collector", {
  enumerable: true,
  get: function () {
    return _collector.Collector;
  }
});
Object.defineProperty(exports, "CollectorFetchContext", {
  enumerable: true,
  get: function () {
    return _collector.CollectorFetchContext;
  }
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _config.config;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _collector = require("./collector");

var _config = require("./config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const plugin = initializerContext => new _plugin.UsageCollectionPlugin(initializerContext);

exports.plugin = plugin;