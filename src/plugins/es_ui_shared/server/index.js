"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "isEsError", {
  enumerable: true,
  get: function () {
    return _errors.isEsError;
  }
});
Object.defineProperty(exports, "handleEsError", {
  enumerable: true,
  get: function () {
    return _errors.handleEsError;
  }
});
Object.defineProperty(exports, "parseEsError", {
  enumerable: true,
  get: function () {
    return _errors.parseEsError;
  }
});

var _errors = require("./errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** dummy plugin*/
function plugin() {
  return new class EsUiSharedPlugin {
    setup() {}

    start() {}

  }();
}