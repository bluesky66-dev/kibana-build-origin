"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSnapshotRepositoriesRoutes = void 0;

var _register_fetch_route = require("./register_fetch_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerSnapshotRepositoriesRoutes = deps => {
  (0, _register_fetch_route.registerFetchRoute)(deps);
};

exports.registerSnapshotRepositoriesRoutes = registerSnapshotRepositoriesRoutes;