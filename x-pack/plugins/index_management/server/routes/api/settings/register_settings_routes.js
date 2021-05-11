"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSettingsRoutes = registerSettingsRoutes;

var _register_load_route = require("./register_load_route");

var _register_update_route = require("./register_update_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerSettingsRoutes(dependencies) {
  (0, _register_load_route.registerLoadRoute)(dependencies);
  (0, _register_update_route.registerUpdateRoute)(dependencies);
}