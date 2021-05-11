"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerWorkplaceSearchRoutes = void 0;

var _groups = require("./groups");

var _overview = require("./overview");

var _security = require("./security");

var _settings = require("./settings");

var _sources = require("./sources");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerWorkplaceSearchRoutes = dependencies => {
  (0, _overview.registerOverviewRoute)(dependencies);
  (0, _groups.registerGroupsRoutes)(dependencies);
  (0, _sources.registerSourcesRoutes)(dependencies);
  (0, _settings.registerSettingsRoutes)(dependencies);
  (0, _security.registerSecurityRoutes)(dependencies);
};

exports.registerWorkplaceSearchRoutes = registerWorkplaceSearchRoutes;