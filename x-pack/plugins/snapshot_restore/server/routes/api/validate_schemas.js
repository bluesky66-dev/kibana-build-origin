"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.restoreSettingsSchema = exports.repositorySchema = exports.policySchema = exports.nameParameterSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const nameParameterSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
});

exports.nameParameterSchema = nameParameterSchema;

const snapshotConfigSchema = _configSchema.schema.object({
  indices: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
  ignoreUnavailable: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  includeGlobalState: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  partial: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  metadata: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string()))
});

const snapshotRetentionSchema = _configSchema.schema.object({
  expireAfterValue: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.literal('')])),
  expireAfterUnit: _configSchema.schema.maybe(_configSchema.schema.string()),
  maxCount: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.literal('')])),
  minCount: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.literal('')]))
});

const policySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  snapshotName: _configSchema.schema.string(),
  schedule: _configSchema.schema.string(),
  repository: _configSchema.schema.string(),
  config: _configSchema.schema.maybe(snapshotConfigSchema),
  retention: _configSchema.schema.maybe(snapshotRetentionSchema),
  isManagedPolicy: _configSchema.schema.boolean()
});

exports.policySchema = policySchema;

const fsRepositorySettings = _configSchema.schema.object({
  location: _configSchema.schema.string(),
  compress: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  chunkSize: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.literal(null)])),
  maxRestoreBytesPerSec: _configSchema.schema.maybe(_configSchema.schema.string()),
  maxSnapshotBytesPerSec: _configSchema.schema.maybe(_configSchema.schema.string()),
  readonly: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

const fsRepositorySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  type: _configSchema.schema.string(),
  settings: fsRepositorySettings
});

const readOnlyRepositorySettings = _configSchema.schema.object({
  url: _configSchema.schema.string()
});

const readOnlyRepository = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  type: _configSchema.schema.string(),
  settings: readOnlyRepositorySettings
});

const s3RepositorySettings = _configSchema.schema.object({
  bucket: _configSchema.schema.string(),
  client: _configSchema.schema.maybe(_configSchema.schema.string()),
  basePath: _configSchema.schema.maybe(_configSchema.schema.string()),
  compress: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  chunkSize: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.literal(null)])),
  serverSideEncryption: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  bufferSize: _configSchema.schema.maybe(_configSchema.schema.string()),
  cannedAcl: _configSchema.schema.maybe(_configSchema.schema.string()),
  storageClass: _configSchema.schema.maybe(_configSchema.schema.string()),
  maxRestoreBytesPerSec: _configSchema.schema.maybe(_configSchema.schema.string()),
  maxSnapshotBytesPerSec: _configSchema.schema.maybe(_configSchema.schema.string()),
  readonly: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

const s3Repository = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  type: _configSchema.schema.string(),
  settings: s3RepositorySettings
});

const hdsRepositorySettings = _configSchema.schema.object({
  uri: _configSchema.schema.string(),
  path: _configSchema.schema.string(),
  loadDefaults: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  compress: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  chunkSize: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.literal(null)])),
  maxRestoreBytesPerSec: _configSchema.schema.maybe(_configSchema.schema.string()),
  maxSnapshotBytesPerSec: _configSchema.schema.maybe(_configSchema.schema.string()),
  readonly: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  ['security.principal']: _configSchema.schema.maybe(_configSchema.schema.string())
}, {
  unknowns: 'allow'
});

const hdsfRepository = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  type: _configSchema.schema.string(),
  settings: hdsRepositorySettings
});

const azureRepositorySettings = _configSchema.schema.object({
  client: _configSchema.schema.maybe(_configSchema.schema.string()),
  container: _configSchema.schema.maybe(_configSchema.schema.string()),
  basePath: _configSchema.schema.maybe(_configSchema.schema.string()),
  locationMode: _configSchema.schema.maybe(_configSchema.schema.string()),
  compress: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  chunkSize: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.literal(null)])),
  maxRestoreBytesPerSec: _configSchema.schema.maybe(_configSchema.schema.string()),
  maxSnapshotBytesPerSec: _configSchema.schema.maybe(_configSchema.schema.string()),
  readonly: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

const azureRepository = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  type: _configSchema.schema.string(),
  settings: azureRepositorySettings
});

const gcsRepositorySettings = _configSchema.schema.object({
  bucket: _configSchema.schema.string(),
  client: _configSchema.schema.maybe(_configSchema.schema.string()),
  basePath: _configSchema.schema.maybe(_configSchema.schema.string()),
  compress: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  chunkSize: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.literal(null)])),
  maxRestoreBytesPerSec: _configSchema.schema.maybe(_configSchema.schema.string()),
  maxSnapshotBytesPerSec: _configSchema.schema.maybe(_configSchema.schema.string()),
  readonly: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

const gcsRepository = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  type: _configSchema.schema.string(),
  settings: gcsRepositorySettings
});

const sourceRepository = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  type: _configSchema.schema.string(),
  settings: _configSchema.schema.oneOf([fsRepositorySettings, readOnlyRepositorySettings, s3RepositorySettings, hdsRepositorySettings, azureRepositorySettings, gcsRepositorySettings, _configSchema.schema.object({
    delegateType: _configSchema.schema.string()
  }, {
    unknowns: 'allow'
  })])
});

const repositorySchema = _configSchema.schema.oneOf([fsRepositorySchema, readOnlyRepository, sourceRepository, s3Repository, hdsfRepository, azureRepository, gcsRepository]);

exports.repositorySchema = repositorySchema;

const restoreSettingsSchema = _configSchema.schema.object({
  indices: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
  renamePattern: _configSchema.schema.maybe(_configSchema.schema.string()),
  renameReplacement: _configSchema.schema.maybe(_configSchema.schema.string()),
  includeGlobalState: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  partial: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  indexSettings: _configSchema.schema.maybe(_configSchema.schema.string()),
  ignoreIndexSettings: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  ignoreUnavailable: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.restoreSettingsSchema = restoreSettingsSchema;