"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoleMappingRoutes = defineRoleMappingRoutes;

var _feature_check = require("./feature_check");

var _get = require("./get");

var _post = require("./post");

var _delete = require("./delete");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineRoleMappingRoutes(params) {
  (0, _feature_check.defineRoleMappingFeatureCheckRoute)(params);
  (0, _get.defineRoleMappingGetRoutes)(params);
  (0, _post.defineRoleMappingPostRoutes)(params);
  (0, _delete.defineRoleMappingDeleteRoutes)(params);
}