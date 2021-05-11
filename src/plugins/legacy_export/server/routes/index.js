"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _import = require("./import");

var _export = require("./export");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerRoutes = (router, kibanaVersion, maxImportPayloadBytes) => {
  (0, _export.registerExportRoute)(router, kibanaVersion);
  (0, _import.registerImportRoute)(router, maxImportPayloadBytes);
};

exports.registerRoutes = registerRoutes;