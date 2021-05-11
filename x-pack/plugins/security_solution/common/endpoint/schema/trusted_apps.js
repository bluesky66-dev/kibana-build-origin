"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostTrustedAppCreateRequestSchema = exports.GetTrustedAppsRequestSchema = exports.DeleteTrustedAppsRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _types = require("../types");

var _trusted_apps = require("../validation/trusted_apps");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const entryFieldLabels = {
  [_types.ConditionEntryField.HASH]: 'Hash',
  [_types.ConditionEntryField.PATH]: 'Path',
  [_types.ConditionEntryField.SIGNER]: 'Signer'
};
const DeleteTrustedAppsRequestSchema = {
  params: _configSchema.schema.object({
    id: _configSchema.schema.string()
  })
};
exports.DeleteTrustedAppsRequestSchema = DeleteTrustedAppsRequestSchema;
const GetTrustedAppsRequestSchema = {
  query: _configSchema.schema.object({
    page: _configSchema.schema.maybe(_configSchema.schema.number({
      defaultValue: 1,
      min: 1
    })),
    per_page: _configSchema.schema.maybe(_configSchema.schema.number({
      defaultValue: 20,
      min: 1
    }))
  })
};
exports.GetTrustedAppsRequestSchema = GetTrustedAppsRequestSchema;

const ConditionEntryTypeSchema = _configSchema.schema.literal('match');

const ConditionEntryOperatorSchema = _configSchema.schema.literal('included');

const HashConditionEntrySchema = _configSchema.schema.object({
  field: _configSchema.schema.literal(_types.ConditionEntryField.HASH),
  type: ConditionEntryTypeSchema,
  operator: ConditionEntryOperatorSchema,
  value: _configSchema.schema.string({
    validate: hash => (0, _trusted_apps.isValidHash)(hash) ? undefined : `Invalid hash value [${hash}]`
  })
});

const PathConditionEntrySchema = _configSchema.schema.object({
  field: _configSchema.schema.literal(_types.ConditionEntryField.PATH),
  type: ConditionEntryTypeSchema,
  operator: ConditionEntryOperatorSchema,
  value: _configSchema.schema.string({
    minLength: 1
  })
});

const SignerConditionEntrySchema = _configSchema.schema.object({
  field: _configSchema.schema.literal(_types.ConditionEntryField.SIGNER),
  type: ConditionEntryTypeSchema,
  operator: ConditionEntryOperatorSchema,
  value: _configSchema.schema.string({
    minLength: 1
  })
});

const createNewTrustedAppForOsScheme = (osSchema, entriesSchema) => _configSchema.schema.object({
  name: _configSchema.schema.string({
    minLength: 1,
    maxLength: 256
  }),
  description: _configSchema.schema.maybe(_configSchema.schema.string({
    minLength: 0,
    maxLength: 256,
    defaultValue: ''
  })),
  os: osSchema,
  entries: _configSchema.schema.arrayOf(entriesSchema, {
    minSize: 1,

    validate(entries) {
      return (0, _trusted_apps.getDuplicateFields)(entries).map(field => `[${entryFieldLabels[field]}] field can only be used once`).join(', ') || undefined;
    }

  })
});

const PostTrustedAppCreateRequestSchema = {
  body: _configSchema.schema.oneOf([createNewTrustedAppForOsScheme(_configSchema.schema.oneOf([_configSchema.schema.literal(_types.OperatingSystem.LINUX), _configSchema.schema.literal(_types.OperatingSystem.MAC)]), _configSchema.schema.oneOf([HashConditionEntrySchema, PathConditionEntrySchema])), createNewTrustedAppForOsScheme(_configSchema.schema.literal(_types.OperatingSystem.WINDOWS), _configSchema.schema.oneOf([HashConditionEntrySchema, PathConditionEntrySchema, SignerConditionEntrySchema]))])
};
exports.PostTrustedAppCreateRequestSchema = PostTrustedAppCreateRequestSchema;