"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postTransformsUpdateRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _transforms = require("./transforms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// POST _transform/{transform_id}/_update


const postTransformsUpdateRequestSchema = _configSchema.schema.object({
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  // we cannot reuse `destSchema` because `index` is optional for the update request
  dest: _configSchema.schema.maybe(_configSchema.schema.object({
    index: _configSchema.schema.string(),
    pipeline: _configSchema.schema.maybe(_configSchema.schema.string())
  })),
  frequency: _configSchema.schema.maybe(_configSchema.schema.string()),
  retention_policy: _configSchema.schema.maybe(_transforms.retentionPolicySchema),
  settings: _configSchema.schema.maybe(_transforms.settingsSchema),
  source: _configSchema.schema.maybe(_transforms.sourceSchema),
  sync: _configSchema.schema.maybe(_transforms.syncSchema)
});

exports.postTransformsUpdateRequestSchema = postTransformsUpdateRequestSchema;