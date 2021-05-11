"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AgentPolicySchema = exports.NewAgentPolicySchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _package_policy = require("./package_policy");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const AgentPolicyBaseSchema = {
  name: _configSchema.schema.string({
    minLength: 1
  }),
  namespace: _package_policy.NamespaceSchema,
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  is_managed: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  monitoring_enabled: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.literal(_common.dataTypes.Logs), _configSchema.schema.literal(_common.dataTypes.Metrics)])))
};

const NewAgentPolicySchema = _configSchema.schema.object({ ...AgentPolicyBaseSchema
});

exports.NewAgentPolicySchema = NewAgentPolicySchema;

const AgentPolicySchema = _configSchema.schema.object({ ...AgentPolicyBaseSchema,
  id: _configSchema.schema.string(),
  is_managed: _configSchema.schema.boolean(),
  status: _configSchema.schema.oneOf([_configSchema.schema.literal(_common.agentPolicyStatuses.Active), _configSchema.schema.literal(_common.agentPolicyStatuses.Inactive)]),
  package_policies: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.arrayOf(_package_policy.PackagePolicySchema)]),
  updated_at: _configSchema.schema.string(),
  updated_by: _configSchema.schema.string()
});

exports.AgentPolicySchema = AgentPolicySchema;