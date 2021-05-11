"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerComponentTemplateRoutes = registerComponentTemplateRoutes;

var _get = require("./get");

var _create = require("./create");

var _update = require("./update");

var _delete = require("./delete");

var _privileges = require("./privileges");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerComponentTemplateRoutes(dependencies) {
  (0, _get.registerGetAllRoute)(dependencies);
  (0, _create.registerCreateRoute)(dependencies);
  (0, _update.registerUpdateRoute)(dependencies);
  (0, _delete.registerDeleteRoute)(dependencies);
  (0, _privileges.registerPrivilegesRoute)(dependencies);
}