"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineSessionManagementRoutes = defineSessionManagementRoutes;

var _extend = require("./extend");

var _info = require("./info");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineSessionManagementRoutes(params) {
  (0, _info.defineSessionInfoRoutes)(params);
  (0, _extend.defineSessionExtendRoutes)(params);
}