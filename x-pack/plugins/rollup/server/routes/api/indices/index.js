"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerIndicesRoutes = registerIndicesRoutes;

var _register_get_route = require("./register_get_route");

var _register_validate_index_pattern_route = require("./register_validate_index_pattern_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerIndicesRoutes(dependencies) {
  (0, _register_get_route.registerGetRoute)(dependencies);
  (0, _register_validate_index_pattern_route.registerValidateIndexPatternRoute)(dependencies);
}