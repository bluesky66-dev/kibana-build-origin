"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteDatafeedQuerySchema = exports.datafeedIdSchema = exports.datafeedConfigSchema = exports.startDatafeedSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const startDatafeedSchema = _configSchema.schema.object({
  start: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.string()])),
  end: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.string()])),
  timeout: _configSchema.schema.maybe(_configSchema.schema.any())
});

exports.startDatafeedSchema = startDatafeedSchema;

const datafeedConfigSchema = _configSchema.schema.object({
  datafeed_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  feed_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  aggregations: _configSchema.schema.maybe(_configSchema.schema.any()),
  aggs: _configSchema.schema.maybe(_configSchema.schema.any()),
  chunking_config: _configSchema.schema.maybe(_configSchema.schema.object({
    mode: _configSchema.schema.maybe(_configSchema.schema.string()),
    time_span: _configSchema.schema.maybe(_configSchema.schema.string())
  })),
  frequency: _configSchema.schema.maybe(_configSchema.schema.string()),
  indices: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  indexes: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  job_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  query: _configSchema.schema.maybe(_configSchema.schema.any()),
  max_empty_searches: _configSchema.schema.maybe(_configSchema.schema.number()),
  query_delay: _configSchema.schema.maybe(_configSchema.schema.string()),
  script_fields: _configSchema.schema.maybe(_configSchema.schema.any()),
  runtime_mappings: _configSchema.schema.maybe(_configSchema.schema.any()),
  scroll_size: _configSchema.schema.maybe(_configSchema.schema.number()),
  delayed_data_check_config: _configSchema.schema.maybe(_configSchema.schema.any()),
  indices_options: _configSchema.schema.maybe(_configSchema.schema.object({
    expand_wildcards: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
    ignore_unavailable: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    allow_no_indices: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    ignore_throttled: _configSchema.schema.maybe(_configSchema.schema.boolean())
  }))
});

exports.datafeedConfigSchema = datafeedConfigSchema;

const datafeedIdSchema = _configSchema.schema.object({
  datafeedId: _configSchema.schema.string()
});

exports.datafeedIdSchema = datafeedIdSchema;

const deleteDatafeedQuerySchema = _configSchema.schema.maybe(_configSchema.schema.object({
  force: _configSchema.schema.maybe(_configSchema.schema.any())
}));

exports.deleteDatafeedQuerySchema = deleteDatafeedQuerySchema;