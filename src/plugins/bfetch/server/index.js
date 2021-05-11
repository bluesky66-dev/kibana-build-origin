"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "BfetchServerSetup", {
  enumerable: true,
  get: function () {
    return _plugin.BfetchServerSetup;
  }
});
Object.defineProperty(exports, "BfetchServerStart", {
  enumerable: true,
  get: function () {
    return _plugin.BfetchServerStart;
  }
});
Object.defineProperty(exports, "BatchProcessingRouteParams", {
  enumerable: true,
  get: function () {
    return _plugin.BatchProcessingRouteParams;
  }
});
Object.defineProperty(exports, "StreamingRequestHandler", {
  enumerable: true,
  get: function () {
    return _types.StreamingRequestHandler;
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
function plugin(initializerContext) {
  return new _plugin.BfetchServerPlugin(initializerContext);
}