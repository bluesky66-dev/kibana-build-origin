"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiRoutes = void 0;

var _app = require("./api/app");

var _repositories = require("./api/repositories");

var _snapshots = require("./api/snapshots");

var _restore = require("./api/restore");

var _policy = require("./api/policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ApiRoutes {
  setup(dependencies) {
    (0, _app.registerAppRoutes)(dependencies);
    (0, _repositories.registerRepositoriesRoutes)(dependencies);
    (0, _snapshots.registerSnapshotsRoutes)(dependencies);
    (0, _restore.registerRestoreRoutes)(dependencies);

    if (dependencies.config.isSlmEnabled) {
      (0, _policy.registerPolicyRoutes)(dependencies);
    }
  }

}

exports.ApiRoutes = ApiRoutes;