"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternManagementPlugin = void 0;

var _routes = require("./routes");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class IndexPatternManagementPlugin {
  constructor(initializerContext) {}

  setup(core) {
    const router = core.http.createRouter();
    (0, _routes.registerPreviewScriptedFieldRoute)(router);
    (0, _routes.registerResolveIndexRoute)(router);
  }

  start() {}

  stop() {}

}

exports.IndexPatternManagementPlugin = IndexPatternManagementPlugin;