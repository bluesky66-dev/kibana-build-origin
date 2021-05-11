"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSearchRoutes = registerSearchRoutes;

var _register_search_route = require("./register_search_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerSearchRoutes(dependencies) {
  (0, _register_search_route.registerSearchRoute)(dependencies);
}