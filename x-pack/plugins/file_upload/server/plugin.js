"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileUploadPlugin = void 0;

var _routes = require("./routes");

var _telemetry = require("./telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class FileUploadPlugin {
  async setup(coreSetup, plugins) {
    (0, _routes.fileUploadRoutes)(coreSetup.http.createRouter());
    (0, _telemetry.initFileUploadTelemetry)(coreSetup, plugins.usageCollection);
  }

  start(core) {}

}

exports.FileUploadPlugin = FileUploadPlugin;