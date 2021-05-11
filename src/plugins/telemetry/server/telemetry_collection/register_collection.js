"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCollection = registerCollection;

var _get_local_stats = require("./get_local_stats");

var _get_cluster_stats = require("./get_cluster_stats");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerCollection(telemetryCollectionManager) {
  telemetryCollectionManager.setCollectionStrategy({
    title: 'local',
    priority: 0,
    statsGetter: _get_local_stats.getLocalStats,
    clusterDetailsGetter: _get_cluster_stats.getClusterUuids
  });
}