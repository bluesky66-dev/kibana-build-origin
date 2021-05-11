"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _configurations = require("./configurations");

var _tokens = require("./tokens");

var _tags = require("./tags");

var _beats = require("./beats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerRoutes = router => {
  // configurations
  (0, _configurations.registerGetConfigurationBlocksRoute)(router);
  (0, _configurations.registerDeleteConfigurationBlocksRoute)(router);
  (0, _configurations.registerUpsertConfigurationBlocksRoute)(router); // beats

  (0, _beats.registerBeatUpdateRoute)(router);
  (0, _beats.registerTagRemovalsRoute)(router);
  (0, _beats.registerTagAssignmentsRoute)(router);
  (0, _beats.registerListAgentsRoute)(router);
  (0, _beats.registerGetBeatRoute)(router);
  (0, _beats.registerBeatEventsRoute)(router);
  (0, _beats.registerBeatEnrollmentRoute)(router);
  (0, _beats.registerGetBeatConfigurationRoute)(router); // tags

  (0, _tags.registerSetTagRoute)(router);
  (0, _tags.registerListTagsRoute)(router);
  (0, _tags.registerGetTagsWithIdsRoute)(router);
  (0, _tags.registerDeleteTagsWithIdsRoute)(router);
  (0, _tags.registerAssignableTagsRoute)(router); // tokens

  (0, _tokens.registerCreateTokenRoute)(router);
};

exports.registerRoutes = registerRoutes;