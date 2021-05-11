"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldHistogramsRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const fieldHistogramsRequestSchema = _configSchema.schema.object({
  /** Query to match documents in the index. */
  query: _configSchema.schema.any(),

  /** The fields to return histogram data. */
  fields: _configSchema.schema.arrayOf(_configSchema.schema.any()),

  /** Optional runtime mappings */
  runtimeMappings: _common.runtimeMappingsSchema,

  /** Number of documents to be collected in the sample processed on each shard, or -1 for no sampling. */
  samplerShardSize: _configSchema.schema.number()
});

exports.fieldHistogramsRequestSchema = fieldHistogramsRequestSchema;