"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAgentsSetup = isAgentsSetup;
exports.ensureAgentActionPolicyChangeExists = ensureAgentActionPolicyChangeExists;

var _constants = require("../../constants");

var _agent_policy = require("../agent_policy");

var _output = require("../output");

var _actions = require("./actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function isAgentsSetup(soClient) {
  const adminUser = await _output.outputService.getAdminUser(soClient, false);
  const outputId = await _output.outputService.getDefaultOutputId(soClient); // If admin user (fleet_enroll) and output id exist Agents are correctly setup

  return adminUser && outputId ? true : false;
}
/**
 * During the migration from 7.9 to 7.10 we introduce a new agent action POLICY_CHANGE per policy
 * this function ensure that action exist for each policy
 *
 * @param soClient
 */


async function ensureAgentActionPolicyChangeExists(soClient) {
  // If Agents are not setup skip
  if (!(await isAgentsSetup(soClient))) {
    return;
  }

  const {
    items: agentPolicies
  } = await _agent_policy.agentPolicyService.list(soClient, {
    perPage: _constants.SO_SEARCH_LIMIT
  });
  await Promise.all(agentPolicies.map(async agentPolicy => {
    const policyChangeActionExist = !!(await (0, _actions.getLatestConfigChangeAction)(soClient, agentPolicy.id));

    if (!policyChangeActionExist) {
      return _agent_policy.agentPolicyService.createFleetPolicyChangeAction(soClient, agentPolicy.id);
    }
  }));
}