"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerIndexRoutes = registerIndexRoutes;

var _register_retry_route = require("./register_retry_route");

var _register_remove_route = require("./register_remove_route");

var _register_add_policy_route = require("./register_add_policy_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerIndexRoutes(dependencies) {
  (0, _register_retry_route.registerRetryRoute)(dependencies);
  (0, _register_remove_route.registerRemoveRoute)(dependencies);
  (0, _register_add_policy_route.registerAddPolicyRoute)(dependencies);
}