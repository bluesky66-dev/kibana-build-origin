"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupInterpreter = setupInterpreter;

var _server = require("../canvas_plugin_src/functions/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function setupInterpreter(expressions) {
  _server.functions.forEach(f => expressions.registerFunction(f));
}