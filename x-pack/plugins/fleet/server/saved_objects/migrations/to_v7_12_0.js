"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateAgentPolicyToV7120 = exports.migrateAgentToV7120 = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migrateAgentToV7120 = agentDoc => {
  delete agentDoc.attributes.shared_id;
  return agentDoc;
};

exports.migrateAgentToV7120 = migrateAgentToV7120;

const migrateAgentPolicyToV7120 = agentPolicyDoc => {
  agentPolicyDoc.attributes.is_managed = false;
  agentPolicyDoc.attributes.is_default_fleet_server = false;
  return agentPolicyDoc;
};

exports.migrateAgentPolicyToV7120 = migrateAgentPolicyToV7120;