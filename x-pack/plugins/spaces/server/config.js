"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfig$ = createConfig$;
exports.spacesConfigDeprecationProvider = exports.ConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ConfigSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  maxSpaces: _configSchema.schema.number({
    defaultValue: 1000
  })
});

exports.ConfigSchema = ConfigSchema;

function createConfig$(context) {
  return context.config.create();
}

const disabledDeprecation = (config, fromPath, log) => {
  var _config$xpack, _config$xpack$spaces;

  if (((_config$xpack = config.xpack) === null || _config$xpack === void 0 ? void 0 : (_config$xpack$spaces = _config$xpack.spaces) === null || _config$xpack$spaces === void 0 ? void 0 : _config$xpack$spaces.enabled) === false) {
    log(`Disabling the spaces plugin (xpack.spaces.enabled) will not be supported in the next major version (8.0)`);
  }

  return config;
};

const spacesConfigDeprecationProvider = () => {
  return [disabledDeprecation];
};

exports.spacesConfigDeprecationProvider = spacesConfigDeprecationProvider;