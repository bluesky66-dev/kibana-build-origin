"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.definePrivilegesRoutes = definePrivilegesRoutes;

var _get = require("./get");

var _get_builtin = require("./get_builtin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function definePrivilegesRoutes(params) {
  (0, _get.defineGetPrivilegesRoutes)(params);
  (0, _get_builtin.defineGetBuiltinPrivilegesRoutes)(params);
}