"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LegacyExportPlugin = void 0;

var _routes = require("./routes");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class LegacyExportPlugin {
  constructor(initContext) {
    this.initContext = initContext;
  }

  setup({
    http
  }) {
    const globalConfig = this.initContext.config.legacy.get();
    const router = http.createRouter();
    (0, _routes.registerRoutes)(router, this.initContext.env.packageInfo.version, globalConfig.savedObjects.maxImportPayloadBytes.getValueInBytes());
    return {};
  }

  start() {
    return {};
  }

  stop() {}

}

exports.LegacyExportPlugin = LegacyExportPlugin;