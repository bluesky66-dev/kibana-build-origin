"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beatsManagementConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_ENROLLMENT_TOKENS_TTL_S = 10 * 60; // 10 minutes

const beatsManagementConfigSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  defaultUserRoles: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: ['superuser']
  }),
  encryptionKey: _configSchema.schema.string({
    defaultValue: 'xpack_beats_default_encryptionKey'
  }),
  enrollmentTokensTtlInSeconds: _configSchema.schema.number({
    min: 1,
    max: 10 * 60 * 14,
    // No more then 2 weeks for security reasons,
    defaultValue: DEFAULT_ENROLLMENT_TOKENS_TTL_S
  })
});

exports.beatsManagementConfigSchema = beatsManagementConfigSchema;