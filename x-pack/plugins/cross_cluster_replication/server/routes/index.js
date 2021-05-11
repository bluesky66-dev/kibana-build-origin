"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerApiRoutes = registerApiRoutes;

var _auto_follow_pattern = require("./api/auto_follow_pattern");

var _follower_index = require("./api/follower_index");

var _cross_cluster_replication = require("./api/cross_cluster_replication");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerApiRoutes(dependencies) {
  (0, _auto_follow_pattern.registerAutoFollowPatternRoutes)(dependencies);
  (0, _follower_index.registerFollowerIndexRoutes)(dependencies);
  (0, _cross_cluster_replication.registerCrossClusterReplicationRoutes)(dependencies);
}