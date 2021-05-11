"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.configSchema = void 0;

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
  ui: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  })
});

exports.configSchema = configSchema;
const config = {
  schema: configSchema,
  exposeToBrowser: {
    ui: true
  }
};
exports.config = config;