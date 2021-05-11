"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGrokdebuggerRoutes = registerGrokdebuggerRoutes;

var _register_grok_simulate_route = require("./register_grok_simulate_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerGrokdebuggerRoutes(framework) {
  (0, _register_grok_simulate_route.registerGrokSimulateRoute)(framework);
}