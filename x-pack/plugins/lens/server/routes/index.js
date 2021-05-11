"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupRoutes = setupRoutes;

var _existing_fields = require("./existing_fields");

var _field_stats = require("./field_stats");

var _telemetry = require("./telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function setupRoutes(setup, logger) {
  (0, _existing_fields.existingFieldsRoute)(setup, logger);
  (0, _field_stats.initFieldsRoute)(setup);
  (0, _telemetry.initLensUsageRoute)(setup);
}