"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCrossClusterReplicationRoutes = registerCrossClusterReplicationRoutes;

var _register_permissions_route = require("./register_permissions_route");

var _register_stats_route = require("./register_stats_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerCrossClusterReplicationRoutes(dependencies) {
  (0, _register_permissions_route.registerPermissionsRoute)(dependencies);
  (0, _register_stats_route.registerStatsRoute)(dependencies);
}