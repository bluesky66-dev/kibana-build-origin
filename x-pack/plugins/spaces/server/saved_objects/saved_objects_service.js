"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpacesSavedObjectsService = void 0;

var _mappings = require("./mappings");

var _migrations = require("./migrations");

var _saved_objects_client_wrapper_factory = require("./saved_objects_client_wrapper_factory");

var _usage_stats = require("../usage_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class SpacesSavedObjectsService {
  setup({
    core,
    getSpacesService
  }) {
    core.savedObjects.registerType({
      name: 'space',
      hidden: true,
      namespaceType: 'agnostic',
      mappings: _mappings.SpacesSavedObjectMappings,
      migrations: {
        '6.6.0': _migrations.migrateToKibana660
      }
    });
    core.savedObjects.registerType({
      name: _usage_stats.SPACES_USAGE_STATS_TYPE,
      hidden: true,
      namespaceType: 'agnostic',
      mappings: _mappings.UsageStatsMappings
    });
    core.savedObjects.addClientWrapper(Number.MIN_SAFE_INTEGER, 'spaces', (0, _saved_objects_client_wrapper_factory.spacesSavedObjectsClientWrapperFactory)(getSpacesService));
  }

}

exports.SpacesSavedObjectsService = SpacesSavedObjectsService;