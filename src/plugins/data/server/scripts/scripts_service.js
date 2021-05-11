"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScriptsService = void 0;

var _route = require("./route");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ScriptsService {
  setup({
    http
  }) {
    (0, _route.registerScriptsRoute)(http.createRouter());
  }

  start() {}

}

exports.ScriptsService = ScriptsService;