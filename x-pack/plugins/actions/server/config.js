"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _actions_config = require("./actions_config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const preconfiguredActionSchema = _configSchema.schema.object({
  name: _configSchema.schema.string({
    minLength: 1
  }),
  actionTypeId: _configSchema.schema.string({
    minLength: 1
  }),
  config: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  }),
  secrets: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  })
});

const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  allowedHosts: _configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.string({
    hostname: true
  }), _configSchema.schema.literal(_actions_config.AllowedHosts.Any)]), {
    defaultValue: [_actions_config.AllowedHosts.Any]
  }),
  enabledActionTypes: _configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.literal(_actions_config.EnabledActionTypes.Any)]), {
    defaultValue: [_actions_config.AllowedHosts.Any]
  }),
  preconfigured: _configSchema.schema.recordOf(_configSchema.schema.string(), preconfiguredActionSchema, {
    defaultValue: {},
    validate: validatePreconfigured
  }),
  proxyUrl: _configSchema.schema.maybe(_configSchema.schema.string()),
  proxyHeaders: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string())),
  proxyRejectUnauthorizedCertificates: _configSchema.schema.boolean({
    defaultValue: true
  }),
  rejectUnauthorized: _configSchema.schema.boolean({
    defaultValue: true
  }),
  maxResponseContentLength: _configSchema.schema.byteSize({
    defaultValue: '1mb'
  }),
  responseTimeout: _configSchema.schema.duration({
    defaultValue: '60s'
  })
});

exports.configSchema = configSchema;
const invalidActionIds = new Set(['', '__proto__', 'constructor']);

function validatePreconfigured(preconfigured) {
  // check for ids that should not be used
  for (const id of Object.keys(preconfigured)) {
    if (invalidActionIds.has(id)) {
      return `invalid preconfigured action id "${id}"`;
    }
  } // in case __proto__ was used as a preconfigured action id ...


  if (Object.getPrototypeOf(preconfigured) !== Object.getPrototypeOf({})) {
    return `invalid preconfigured action id "__proto__"`;
  }
}