"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerApiRoutes = registerApiRoutes;

var _indices = require("./api/indices");

var _jobs = require("./api/jobs");

var _search = require("./api/search");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerApiRoutes(dependencies) {
  (0, _indices.registerIndicesRoutes)(dependencies);
  (0, _jobs.registerJobsRoutes)(dependencies);
  (0, _search.registerSearchRoutes)(dependencies);
}