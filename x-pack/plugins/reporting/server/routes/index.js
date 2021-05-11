"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;

var _generation = require("./generation");

var _jobs = require("./jobs");

var _diagnostic = require("./diagnostic");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerRoutes(reporting, logger) {
  (0, _generation.registerJobGenerationRoutes)(reporting, logger);
  (0, _jobs.registerJobInfoRoutes)(reporting);
  (0, _diagnostic.registerDiagnosticRoutes)(reporting, logger);
}