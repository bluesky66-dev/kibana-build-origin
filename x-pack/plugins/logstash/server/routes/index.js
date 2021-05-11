"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;

var _cluster = require("./cluster");

var _pipeline = require("./pipeline");

var _pipelines = require("./pipelines");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerRoutes(router, security) {
  (0, _cluster.registerClusterLoadRoute)(router);
  (0, _pipeline.registerPipelineDeleteRoute)(router);
  (0, _pipeline.registerPipelineLoadRoute)(router);
  (0, _pipeline.registerPipelineSaveRoute)(router, security);
  (0, _pipelines.registerPipelinesListRoute)(router);
  (0, _pipelines.registerPipelinesDeleteRoute)(router);
}