"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDataStreamRoutes = registerDataStreamRoutes;

var _register_get_route = require("./register_get_route");

var _register_delete_route = require("./register_delete_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerDataStreamRoutes(dependencies) {
  (0, _register_get_route.registerGetOneRoute)(dependencies);
  (0, _register_get_route.registerGetAllRoute)(dependencies);
  (0, _register_delete_route.registerDeleteRoute)(dependencies);
}