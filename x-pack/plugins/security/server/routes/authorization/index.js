"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineAuthorizationRoutes = defineAuthorizationRoutes;

var _privileges = require("./privileges");

var _roles = require("./roles");

var _reset_session_page = require("./reset_session_page");

var _spaces = require("./spaces");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineAuthorizationRoutes(params) {
  (0, _roles.defineRolesRoutes)(params);
  (0, _privileges.definePrivilegesRoutes)(params);
  (0, _reset_session_page.resetSessionPageRoutes)(params);
  (0, _spaces.defineShareSavedObjectPermissionRoutes)(params);
}