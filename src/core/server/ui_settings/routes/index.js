"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;

var _delete = require("./delete");

var _get = require("./get");

var _set_many = require("./set_many");

var _set = require("./set");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerRoutes(router) {
  (0, _get.registerGetRoute)(router);
  (0, _delete.registerDeleteRoute)(router);
  (0, _set.registerSetRoute)(router);
  (0, _set_many.registerSetManyRoute)(router);
}