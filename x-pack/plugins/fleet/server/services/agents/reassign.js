"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reassignAgent = reassignAgent;
exports.reassignAgentIsAllowed = reassignAgentIsAllowed;
exports.reassignAgents = reassignAgents;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _agent_policy = require("../agent_policy");

var _crud = require("./crud");

var _errors = require("../../errors");

var _actions = require("./actions");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function reassignAgent(soClient, esClient, agentId, newAgentPolicyId) {
  const newAgentPolicy = await _agent_policy.agentPolicyService.get(soClient, newAgentPolicyId);

  if (!newAgentPolicy) {
    throw _boom.default.notFound(`Agent policy not found: ${newAgentPolicyId}`);
  }

  await reassignAgentIsAllowed(soClient, esClient, agentId, newAgentPolicyId);
  await (0, _crud.updateAgent)(soClient, esClient, agentId, {
    policy_id: newAgentPolicyId,
    policy_revision: null
  });
  await (0, _actions.createAgentAction)(soClient, esClient, {
    agent_id: agentId,
    created_at: new Date().toISOString(),
    type: 'INTERNAL_POLICY_REASSIGN'
  });
}

async function reassignAgentIsAllowed(soClient, esClient, agentId, newAgentPolicyId) {
  const agentPolicy = await (0, _crud.getAgentPolicyForAgent)(soClient, esClient, agentId);

  if (agentPolicy !== null && agentPolicy !== void 0 && agentPolicy.is_managed) {
    throw new _errors.AgentReassignmentError(`Cannot reassign an agent from managed agent policy ${agentPolicy.id}`);
  }

  const newAgentPolicy = await _agent_policy.agentPolicyService.get(soClient, newAgentPolicyId);

  if (newAgentPolicy !== null && newAgentPolicy !== void 0 && newAgentPolicy.is_managed) {
    throw new _errors.AgentReassignmentError(`Cannot reassign an agent to managed agent policy ${newAgentPolicy.id}`);
  }

  return true;
}

async function reassignAgents(soClient, esClient, options, newAgentPolicyId) {
  const agentPolicy = await _agent_policy.agentPolicyService.get(soClient, newAgentPolicyId);

  if (!agentPolicy) {
    throw _boom.default.notFound(`Agent policy not found: ${newAgentPolicyId}`);
  } // Filter to agents that do not already use the new agent policy ID


  const agents = 'agentIds' in options ? await (0, _crud.getAgents)(soClient, esClient, options.agentIds) : (await (0, _crud.listAllAgents)(soClient, esClient, {
    kuery: options.kuery,
    showInactive: false
  })).agents; // And which are allowed to unenroll

  const settled = await Promise.allSettled(agents.map(agent => reassignAgentIsAllowed(soClient, esClient, agent.id, newAgentPolicyId).then(_ => agent)));
  const agentsToUpdate = agents.filter((agent, index) => settled[index].status === 'fulfilled' && agent.policy_id !== newAgentPolicyId);
  const res = await (0, _crud.bulkUpdateAgents)(soClient, esClient, agentsToUpdate.map(agent => ({
    agentId: agent.id,
    data: {
      policy_id: newAgentPolicyId,
      policy_revision: null
    }
  })));
  const now = new Date().toISOString();
  await (0, _actions.bulkCreateAgentActions)(soClient, esClient, agentsToUpdate.map(agent => ({
    agent_id: agent.id,
    created_at: now,
    type: 'INTERNAL_POLICY_REASSIGN'
  })));
  return res;
}