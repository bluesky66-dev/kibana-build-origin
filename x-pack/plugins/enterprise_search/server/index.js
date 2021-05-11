"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.configSchema = exports.plugin = void 0;

var _configSchema = require("@kbn/config-schema");

var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = initializerContext => {
  return new _plugin.EnterpriseSearchPlugin(initializerContext);
};

exports.plugin = plugin;

const configSchema = _configSchema.schema.object({
  host: _configSchema.schema.maybe(_configSchema.schema.string()),
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  accessCheckTimeout: _configSchema.schema.number({
    defaultValue: 5000
  }),
  accessCheckTimeoutWarning: _configSchema.schema.number({
    defaultValue: 300
  })
});

exports.configSchema = configSchema;
const config = {
  schema: configSchema,
  exposeToBrowser: {
    host: true
  }
};
exports.config = config;