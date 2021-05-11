"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  showMapVisualizationTypes: _configSchema.schema.boolean({
    defaultValue: false
  }),
  // flag used in functional testing
  showMapsInspectorAdapter: _configSchema.schema.boolean({
    defaultValue: false
  }),
  // flag used in functional testing
  preserveDrawingBuffer: _configSchema.schema.boolean({
    defaultValue: false
  })
});

exports.configSchema = configSchema;