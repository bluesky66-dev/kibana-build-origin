"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_AGENT_POLICIES_PACKAGES = exports.DEFAULT_FLEET_SERVER_AGENT_POLICY = exports.DEFAULT_AGENT_POLICY = exports.agentPolicyStatuses = exports.AGENT_POLICY_INDEX = exports.AGENT_POLICY_SAVED_OBJECT_TYPE = void 0;

var _epm = require("./epm");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const AGENT_POLICY_SAVED_OBJECT_TYPE = 'ingest-agent-policies';
exports.AGENT_POLICY_SAVED_OBJECT_TYPE = AGENT_POLICY_SAVED_OBJECT_TYPE;
const AGENT_POLICY_INDEX = '.fleet-policies';
exports.AGENT_POLICY_INDEX = AGENT_POLICY_INDEX;
const agentPolicyStatuses = {
  Active: 'active',
  Inactive: 'inactive'
};
exports.agentPolicyStatuses = agentPolicyStatuses;
const DEFAULT_AGENT_POLICY = {
  name: 'Default policy',
  namespace: 'default',
  description: 'Default agent policy created by Kibana',
  status: agentPolicyStatuses.Active,
  package_policies: [],
  is_default: true,
  is_managed: false,
  monitoring_enabled: ['logs', 'metrics']
};
exports.DEFAULT_AGENT_POLICY = DEFAULT_AGENT_POLICY;
const DEFAULT_FLEET_SERVER_AGENT_POLICY = {
  name: 'Default Fleet Server policy',
  namespace: 'default',
  description: 'Default Fleet Server agent policy created by Kibana',
  status: agentPolicyStatuses.Active,
  package_policies: [],
  is_default: false,
  is_default_fleet_server: true,
  is_managed: false,
  monitoring_enabled: ['logs', 'metrics']
};
exports.DEFAULT_FLEET_SERVER_AGENT_POLICY = DEFAULT_FLEET_SERVER_AGENT_POLICY;
const DEFAULT_AGENT_POLICIES_PACKAGES = [_epm.defaultPackages.System];
exports.DEFAULT_AGENT_POLICIES_PACKAGES = DEFAULT_AGENT_POLICIES_PACKAGES;