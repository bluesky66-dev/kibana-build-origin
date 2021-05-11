"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLicenseRoutes = registerLicenseRoutes;

var _register_refresh_route = require("./register_refresh_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerLicenseRoutes(deps) {
  (0, _register_refresh_route.registerRefreshRoute)(deps);
}