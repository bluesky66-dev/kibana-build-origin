"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiRoutes = void 0;

var _data_streams = require("./api/data_streams");

var _indices = require("./api/indices");

var _templates = require("./api/templates");

var _mapping = require("./api/mapping");

var _settings = require("./api/settings");

var _stats = require("./api/stats");

var _component_templates = require("./api/component_templates");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ApiRoutes {
  setup(dependencies) {
    (0, _data_streams.registerDataStreamRoutes)(dependencies);
    (0, _indices.registerIndicesRoutes)(dependencies);
    (0, _templates.registerTemplateRoutes)(dependencies);
    (0, _settings.registerSettingsRoutes)(dependencies);
    (0, _stats.registerStatsRoute)(dependencies);
    (0, _mapping.registerMappingRoute)(dependencies);
    (0, _component_templates.registerComponentTemplateRoutes)(dependencies);
  }

  start() {}

  stop() {}

}

exports.ApiRoutes = ApiRoutes;