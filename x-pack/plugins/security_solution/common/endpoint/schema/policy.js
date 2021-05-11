"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetAgentPolicySummaryRequestSchema = exports.GetPolicyResponseSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const GetPolicyResponseSchema = {
  query: _configSchema.schema.object({
    agentId: _configSchema.schema.string()
  })
};
exports.GetPolicyResponseSchema = GetPolicyResponseSchema;
const GetAgentPolicySummaryRequestSchema = {
  query: _configSchema.schema.object({
    package_name: _configSchema.schema.string(),
    policy_id: _configSchema.schema.nullable(_configSchema.schema.string())
  })
};
exports.GetAgentPolicySummaryRequestSchema = GetAgentPolicySummaryRequestSchema;