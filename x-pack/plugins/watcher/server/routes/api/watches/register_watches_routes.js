"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerWatchesRoutes = registerWatchesRoutes;

var _register_list_route = require("./register_list_route");

var _register_delete_route = require("./register_delete_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerWatchesRoutes(deps) {
  (0, _register_list_route.registerListRoute)(deps);
  (0, _register_delete_route.registerDeleteRoute)(deps);
}