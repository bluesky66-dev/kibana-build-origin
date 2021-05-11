"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _config.config;
  }
});
Object.defineProperty(exports, "GlobalSearchBatchedResults", {
  enumerable: true,
  get: function () {
    return _types.GlobalSearchBatchedResults;
  }
});
Object.defineProperty(exports, "GlobalSearchProviderFindOptions", {
  enumerable: true,
  get: function () {
    return _types.GlobalSearchProviderFindOptions;
  }
});
Object.defineProperty(exports, "GlobalSearchProviderResult", {
  enumerable: true,
  get: function () {
    return _types.GlobalSearchProviderResult;
  }
});
Object.defineProperty(exports, "GlobalSearchProviderResultUrl", {
  enumerable: true,
  get: function () {
    return _types.GlobalSearchProviderResultUrl;
  }
});
Object.defineProperty(exports, "GlobalSearchResult", {
  enumerable: true,
  get: function () {
    return _types.GlobalSearchResult;
  }
});
Object.defineProperty(exports, "GlobalSearchFindOptions", {
  enumerable: true,
  get: function () {
    return _types2.GlobalSearchFindOptions;
  }
});
Object.defineProperty(exports, "GlobalSearchProviderContext", {
  enumerable: true,
  get: function () {
    return _types2.GlobalSearchProviderContext;
  }
});
Object.defineProperty(exports, "GlobalSearchPluginStart", {
  enumerable: true,
  get: function () {
    return _types2.GlobalSearchPluginStart;
  }
});
Object.defineProperty(exports, "GlobalSearchPluginSetup", {
  enumerable: true,
  get: function () {
    return _types2.GlobalSearchPluginSetup;
  }
});
Object.defineProperty(exports, "GlobalSearchResultProvider", {
  enumerable: true,
  get: function () {
    return _types2.GlobalSearchResultProvider;
  }
});
Object.defineProperty(exports, "RouteHandlerGlobalSearchContext", {
  enumerable: true,
  get: function () {
    return _types2.RouteHandlerGlobalSearchContext;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _config = require("./config");

var _types = require("../common/types");

var _types2 = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = context => new _plugin.GlobalSearchPlugin(context);

exports.plugin = plugin;