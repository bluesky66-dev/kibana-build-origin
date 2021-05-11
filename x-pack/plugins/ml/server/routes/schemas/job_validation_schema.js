"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateCardinalitySchema = exports.validateJobSchema = exports.modelMemoryLimitSchema = exports.estimateBucketSpanSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _anomaly_detectors_schema = require("./anomaly_detectors_schema");

var _datafeeds_schema = require("./datafeeds_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const estimateBucketSpanSchema = _configSchema.schema.object({
  aggTypes: _configSchema.schema.arrayOf(_configSchema.schema.nullable(_configSchema.schema.string())),
  duration: _configSchema.schema.object({
    start: _configSchema.schema.number(),
    end: _configSchema.schema.number()
  }),
  fields: _configSchema.schema.arrayOf(_configSchema.schema.nullable(_configSchema.schema.string())),
  filters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.any())),
  index: _configSchema.schema.string(),
  query: _configSchema.schema.any(),
  splitField: _configSchema.schema.maybe(_configSchema.schema.string()),
  timeField: _configSchema.schema.maybe(_configSchema.schema.string()),
  runtimeMappings: _configSchema.schema.maybe(_configSchema.schema.any())
});

exports.estimateBucketSpanSchema = estimateBucketSpanSchema;

const modelMemoryLimitSchema = _configSchema.schema.object({
  datafeedConfig: _datafeeds_schema.datafeedConfigSchema,
  analysisConfig: _anomaly_detectors_schema.analysisConfigSchema,
  indexPattern: _configSchema.schema.string(),
  query: _configSchema.schema.any(),
  timeFieldName: _configSchema.schema.string(),
  earliestMs: _configSchema.schema.number(),
  latestMs: _configSchema.schema.number()
});

exports.modelMemoryLimitSchema = modelMemoryLimitSchema;

const validateJobSchema = _configSchema.schema.object({
  duration: _configSchema.schema.maybe(_configSchema.schema.object({
    start: _configSchema.schema.maybe(_configSchema.schema.number()),
    end: _configSchema.schema.maybe(_configSchema.schema.number())
  })),
  fields: _configSchema.schema.maybe(_configSchema.schema.any()),
  job: _configSchema.schema.object(_anomaly_detectors_schema.anomalyDetectionJobSchema)
});

exports.validateJobSchema = validateJobSchema;

const validateCardinalitySchema = _configSchema.schema.object({ ..._anomaly_detectors_schema.anomalyDetectionJobSchema,
  datafeed_config: _datafeeds_schema.datafeedConfigSchema
});

exports.validateCardinalitySchema = validateCardinalitySchema;