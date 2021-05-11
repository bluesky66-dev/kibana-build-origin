"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerJobsRoutes = registerJobsRoutes;

var _register_create_route = require("./register_create_route");

var _register_delete_route = require("./register_delete_route");

var _register_get_route = require("./register_get_route");

var _register_start_route = require("./register_start_route");

var _register_stop_route = require("./register_stop_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerJobsRoutes(dependencies) {
  (0, _register_create_route.registerCreateRoute)(dependencies);
  (0, _register_delete_route.registerDeleteRoute)(dependencies);
  (0, _register_get_route.registerGetRoute)(dependencies);
  (0, _register_start_route.registerStartRoute)(dependencies);
  (0, _register_stop_route.registerStopRoute)(dependencies);
}