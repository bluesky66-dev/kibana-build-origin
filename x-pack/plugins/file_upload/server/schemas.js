"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importFileBodySchema = exports.importFileQuerySchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const importFileQuerySchema = _configSchema.schema.object({
  id: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.importFileQuerySchema = importFileQuerySchema;

const importFileBodySchema = _configSchema.schema.object({
  index: _configSchema.schema.string(),
  data: _configSchema.schema.arrayOf(_configSchema.schema.any()),
  settings: _configSchema.schema.maybe(_configSchema.schema.any()),

  /** Mappings */
  mappings: _configSchema.schema.any(),

  /** Ingest pipeline definition */
  ingestPipeline: _configSchema.schema.object({
    id: _configSchema.schema.maybe(_configSchema.schema.string()),
    pipeline: _configSchema.schema.maybe(_configSchema.schema.any())
  })
});

exports.importFileBodySchema = importFileBodySchema;