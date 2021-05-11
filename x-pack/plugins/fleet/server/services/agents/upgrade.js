"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendUpgradeAgentAction = sendUpgradeAgentAction;
exports.ackAgentUpgraded = ackAgentUpgraded;
exports.sendUpgradeAgentsActions = sendUpgradeAgentsActions;

var _constants = require("../../constants");

var _services = require("../../services");

var _errors = require("../../errors");

var _actions = require("./actions");

var _crud = require("./crud");

var _services2 = require("../../../common/services");

var _app_context = require("../app_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function sendUpgradeAgentAction({
  soClient,
  esClient,
  agentId,
  version,
  sourceUri
}) {
  const now = new Date().toISOString();
  const data = {
    version,
    source_uri: sourceUri
  };
  const agentPolicy = await (0, _crud.getAgentPolicyForAgent)(soClient, esClient, agentId);

  if (agentPolicy !== null && agentPolicy !== void 0 && agentPolicy.is_managed) {
    throw new _errors.IngestManagerError(`Cannot upgrade agent ${agentId} in managed policy ${agentPolicy.id}`);
  }

  await (0, _actions.createAgentAction)(soClient, esClient, {
    agent_id: agentId,
    created_at: now,
    data,
    ack_data: data,
    type: 'UPGRADE'
  });
  await (0, _crud.updateAgent)(soClient, esClient, agentId, {
    upgraded_at: null,
    upgrade_started_at: now
  });
}

async function ackAgentUpgraded(soClient, esClient, agentAction) {
  const {
    attributes: {
      ack_data: ackData
    }
  } = await soClient.get(_constants.AGENT_ACTION_SAVED_OBJECT_TYPE, agentAction.id);
  if (!ackData) throw new Error('data missing from UPGRADE action');
  const {
    version
  } = JSON.parse(ackData);
  if (!version) throw new Error('version missing from UPGRADE action');
  await (0, _crud.updateAgent)(soClient, esClient, agentAction.agent_id, {
    upgraded_at: new Date().toISOString(),
    upgrade_started_at: null
  });
}

async function sendUpgradeAgentsActions(soClient, esClient, options) {
  const kibanaVersion = _app_context.appContextService.getKibanaVersion(); // Filter out agents currently unenrolling, agents unenrolled, and agents not upgradeable


  const agents = 'agentIds' in options ? await (0, _crud.getAgents)(soClient, esClient, options.agentIds) : (await (0, _crud.listAllAgents)(soClient, esClient, {
    kuery: options.kuery,
    showInactive: false
  })).agents; // upgradeable if they pass the version check

  const upgradeableAgents = options.force ? agents : agents.filter(agent => (0, _services2.isAgentUpgradeable)(agent, kibanaVersion)); // get any policy ids from upgradable agents

  const policyIdsToGet = new Set(upgradeableAgents.filter(agent => agent.policy_id).map(agent => agent.policy_id)); // get the agent policies for those ids

  const agentPolicies = await _services.agentPolicyService.getByIDs(soClient, Array.from(policyIdsToGet), {
    fields: ['is_managed']
  }); // throw if any of those agent policies are managed

  for (const policy of agentPolicies) {
    if (policy.is_managed) {
      throw new _errors.IngestManagerError(`Cannot upgrade agent in managed policy ${policy.id}`);
    }
  } // Create upgrade action for each agent


  const now = new Date().toISOString();
  const data = {
    version: options.version,
    source_uri: options.sourceUri
  };
  await (0, _actions.bulkCreateAgentActions)(soClient, esClient, upgradeableAgents.map(agent => ({
    agent_id: agent.id,
    created_at: now,
    data,
    ack_data: data,
    type: 'UPGRADE'
  })));
  return await (0, _crud.bulkUpdateAgents)(soClient, esClient, upgradeableAgents.map(agent => ({
    agentId: agent.id,
    data: {
      upgraded_at: null,
      upgrade_started_at: now
    }
  })));
}