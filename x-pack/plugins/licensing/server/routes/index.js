"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;

var _info = require("./info");

var _feature_usage = require("./feature_usage");

var _internal = require("./internal");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerRoutes(router, featureUsageSetup, getStartServices) {
  (0, _info.registerInfoRoute)(router);
  (0, _feature_usage.registerFeatureUsageRoute)(router, getStartServices);
  (0, _internal.registerRegisterFeatureRoute)(router, featureUsageSetup);
  (0, _internal.registerNotifyFeatureUsageRoute)(router);
}