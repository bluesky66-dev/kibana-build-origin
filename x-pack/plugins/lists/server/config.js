"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigSchema = void 0;

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
  importBufferSize: _configSchema.schema.number({
    defaultValue: 1000,
    min: 1
  }),
  importTimeout: _configSchema.schema.duration({
    defaultValue: '5m',
    validate: value => {
      if (value.asMinutes() < 2) {
        throw new Error('duration cannot be less than 2 minutes');
      } else if (value.asMinutes() > 30) {
        throw new Error('duration cannot be greater than 30 minutes');
      }
    }
  }),
  listIndex: _configSchema.schema.string({
    defaultValue: '.lists'
  }),
  listItemIndex: _configSchema.schema.string({
    defaultValue: '.items'
  }),
  maxImportPayloadBytes: _configSchema.schema.number({
    defaultValue: 9000000,
    min: 1
  })
});

exports.ConfigSchema = ConfigSchema;