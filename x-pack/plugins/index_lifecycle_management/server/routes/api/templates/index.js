"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTemplatesRoutes = registerTemplatesRoutes;

var _register_fetch_route = require("./register_fetch_route");

var _register_add_policy_route = require("./register_add_policy_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerTemplatesRoutes(dependencies) {
  (0, _register_fetch_route.registerFetchRoute)(dependencies);
  (0, _register_add_policy_route.registerAddPolicyRoute)(dependencies);
}