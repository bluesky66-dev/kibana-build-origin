"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canDeleteJobSchema = exports.jobTypeSchema = exports.syncJobObjects = exports.jobsAndCurrentSpace = exports.jobsAndSpaces = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const jobsAndSpaces = _configSchema.schema.object({
  jobType: _configSchema.schema.string(),
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  spaces: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

exports.jobsAndSpaces = jobsAndSpaces;

const jobsAndCurrentSpace = _configSchema.schema.object({
  jobType: _configSchema.schema.string(),
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

exports.jobsAndCurrentSpace = jobsAndCurrentSpace;

const syncJobObjects = _configSchema.schema.object({
  simulate: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.syncJobObjects = syncJobObjects;

const jobTypeSchema = _configSchema.schema.object({
  jobType: _configSchema.schema.string()
});

exports.jobTypeSchema = jobTypeSchema;

const canDeleteJobSchema = _configSchema.schema.object({
  /** List of job IDs. */
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.maybe(_configSchema.schema.string()))
});

exports.canDeleteJobSchema = canDeleteJobSchema;