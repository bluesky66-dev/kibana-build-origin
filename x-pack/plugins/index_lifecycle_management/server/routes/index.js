"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerApiRoutes = registerApiRoutes;

var _index = require("./api/index");

var _nodes = require("./api/nodes");

var _policies = require("./api/policies");

var _templates = require("./api/templates");

var _snapshot_policies = require("./api/snapshot_policies");

var _snapshot_repositories = require("./api/snapshot_repositories");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerApiRoutes(dependencies) {
  (0, _index.registerIndexRoutes)(dependencies);
  (0, _nodes.registerNodesRoutes)(dependencies);
  (0, _policies.registerPoliciesRoutes)(dependencies);
  (0, _templates.registerTemplatesRoutes)(dependencies);
  (0, _snapshot_policies.registerSnapshotPoliciesRoutes)(dependencies);
  (0, _snapshot_repositories.registerSnapshotRepositoriesRoutes)(dependencies);
}