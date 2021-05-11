"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInferenceQuerySchema = exports.optionalModelIdSchema = exports.modelIdSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const modelIdSchema = _configSchema.schema.object({
  /**
   * Model ID
   */
  modelId: _configSchema.schema.string()
});

exports.modelIdSchema = modelIdSchema;

const optionalModelIdSchema = _configSchema.schema.object({
  /**
   * Model ID
   */
  modelId: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.optionalModelIdSchema = optionalModelIdSchema;

const getInferenceQuerySchema = _configSchema.schema.object({
  size: _configSchema.schema.maybe(_configSchema.schema.string()),
  with_pipelines: _configSchema.schema.maybe(_configSchema.schema.string()),
  include: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.getInferenceQuerySchema = getInferenceQuerySchema;