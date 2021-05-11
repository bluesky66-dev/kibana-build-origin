"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRolesRoutes = defineRolesRoutes;

var _get = require("./get");

var _get_all = require("./get_all");

var _delete = require("./delete");

var _put = require("./put");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineRolesRoutes(params) {
  (0, _get.defineGetRolesRoutes)(params);
  (0, _get_all.defineGetAllRolesRoutes)(params);
  (0, _delete.defineDeleteRolesRoutes)(params);
  (0, _put.definePutRolesRoutes)(params);
}