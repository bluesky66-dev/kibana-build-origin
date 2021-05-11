"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const configSchema = _configSchema.schema.object({
  healthCheck: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema,
      defaultValue: '60m'
    })
  }),
  invalidateApiKeysTask: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema,
      defaultValue: '5m'
    }),
    removalDelay: _configSchema.schema.string({
      validate: _lib.validateDurationSchema,
      defaultValue: '1h'
    })
  })
});

exports.configSchema = configSchema;