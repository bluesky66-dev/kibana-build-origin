"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAutoFollowPatternRoutes = registerAutoFollowPatternRoutes;

var _register_create_route = require("./register_create_route");

var _register_delete_route = require("./register_delete_route");

var _register_fetch_route = require("./register_fetch_route");

var _register_get_route = require("./register_get_route");

var _register_pause_route = require("./register_pause_route");

var _register_resume_route = require("./register_resume_route");

var _register_update_route = require("./register_update_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerAutoFollowPatternRoutes(dependencies) {
  (0, _register_create_route.registerCreateRoute)(dependencies);
  (0, _register_delete_route.registerDeleteRoute)(dependencies);
  (0, _register_fetch_route.registerFetchRoute)(dependencies);
  (0, _register_get_route.registerGetRoute)(dependencies);
  (0, _register_pause_route.registerPauseRoute)(dependencies);
  (0, _register_resume_route.registerResumeRoute)(dependencies);
  (0, _register_update_route.registerUpdateRoute)(dependencies);
}