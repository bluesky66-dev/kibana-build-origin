"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobAuditMessagesQuerySchema = exports.jobAuditMessagesJobIdSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const jobAuditMessagesJobIdSchema = _configSchema.schema.object({
  /** Job ID. */
  jobId: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.jobAuditMessagesJobIdSchema = jobAuditMessagesJobIdSchema;

const jobAuditMessagesQuerySchema = _configSchema.schema.maybe(_configSchema.schema.object({
  from: _configSchema.schema.maybe(_configSchema.schema.any())
}));

exports.jobAuditMessagesQuerySchema = jobAuditMessagesQuerySchema;