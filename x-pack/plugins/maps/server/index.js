"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = void 0;

var _plugin = require("./plugin");

var _config = require("../config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  // exposeToBrowser specifies kibana.yml settings to expose to the browser
  // the value `true` in this context signals configuration is exposed to browser
  exposeToBrowser: {
    enabled: true,
    showMapVisualizationTypes: true,
    showMapsInspectorAdapter: true,
    preserveDrawingBuffer: true
  },
  schema: _config.configSchema
};
exports.config = config;

const plugin = initializerContext => new _plugin.MapsPlugin(initializerContext);

exports.plugin = plugin;