"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerWatchRoutes = registerWatchRoutes;

var _register_delete_route = require("./register_delete_route");

var _register_execute_route = require("./register_execute_route");

var _register_load_route = require("./register_load_route");

var _register_save_route = require("./register_save_route");

var _register_history_route = require("./register_history_route");

var _register_activate_route = require("./register_activate_route");

var _register_deactivate_route = require("./register_deactivate_route");

var _register_visualize_route = require("./register_visualize_route");

var _action = require("./action");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerWatchRoutes(deps) {
  (0, _register_delete_route.registerDeleteRoute)(deps);
  (0, _register_execute_route.registerExecuteRoute)(deps);
  (0, _register_load_route.registerLoadRoute)(deps);
  (0, _register_save_route.registerSaveRoute)(deps);
  (0, _register_history_route.registerHistoryRoute)(deps);
  (0, _register_activate_route.registerActivateRoute)(deps);
  (0, _register_deactivate_route.registerDeactivateRoute)(deps);
  (0, _action.registerActionRoutes)(deps);
  (0, _register_visualize_route.registerVisualizeRoute)(deps);
}