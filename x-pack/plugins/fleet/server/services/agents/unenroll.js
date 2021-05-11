"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unenrollAgent = unenrollAgent;
exports.unenrollAgents = unenrollAgents;
exports.forceUnenrollAgent = forceUnenrollAgent;
exports.forceUnenrollAgents = forceUnenrollAgents;

var APIKeyService = _interopRequireWildcard(require("../api_keys"));

var _actions = require("./actions");

var _crud = require("./crud");

var _errors = require("../../errors");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function unenrollAgentIsAllowed(soClient, esClient, agentId) {
  const agentPolicy = await (0, _crud.getAgentPolicyForAgent)(soClient, esClient, agentId);

  if (agentPolicy !== null && agentPolicy !== void 0 && agentPolicy.is_managed) {
    throw new _errors.AgentUnenrollmentError(`Cannot unenroll ${agentId} from a managed agent policy ${agentPolicy.id}`);
  }

  return true;
}

async function unenrollAgent(soClient, esClient, agentId) {
  await unenrollAgentIsAllowed(soClient, esClient, agentId);
  const now = new Date().toISOString();
  await (0, _actions.createAgentAction)(soClient, esClient, {
    agent_id: agentId,
    created_at: now,
    type: 'UNENROLL'
  });
  await (0, _crud.updateAgent)(soClient, esClient, agentId, {
    unenrollment_started_at: now
  });
}

async function unenrollAgents(soClient, esClient, options) {
  const agents = 'agentIds' in options ? await (0, _crud.getAgents)(soClient, esClient, options.agentIds) : (await (0, _crud.listAllAgents)(soClient, esClient, {
    kuery: options.kuery,
    showInactive: false
  })).agents; // Filter to agents that are not already unenrolled, or unenrolling

  const agentsEnrolled = agents.filter(agent => !agent.unenrollment_started_at && !agent.unenrolled_at); // And which are allowed to unenroll

  const settled = await Promise.allSettled(agentsEnrolled.map(agent => unenrollAgentIsAllowed(soClient, esClient, agent.id).then(_ => agent)));
  const agentsToUpdate = agentsEnrolled.filter((_, index) => settled[index].status === 'fulfilled');
  const now = new Date().toISOString(); // Create unenroll action for each agent

  await (0, _actions.bulkCreateAgentActions)(soClient, esClient, agentsToUpdate.map(agent => ({
    agent_id: agent.id,
    created_at: now,
    type: 'UNENROLL'
  }))); // Update the necessary agents

  return (0, _crud.bulkUpdateAgents)(soClient, esClient, agentsToUpdate.map(agent => ({
    agentId: agent.id,
    data: {
      unenrollment_started_at: now
    }
  })));
}

async function forceUnenrollAgent(soClient, esClient, agentId) {
  const agent = await (0, _crud.getAgent)(soClient, esClient, agentId);
  await Promise.all([agent.access_api_key_id ? APIKeyService.invalidateAPIKeys(soClient, [agent.access_api_key_id]) : undefined, agent.default_api_key_id ? APIKeyService.invalidateAPIKeys(soClient, [agent.default_api_key_id]) : undefined]);
  await (0, _crud.updateAgent)(soClient, esClient, agentId, {
    active: false,
    unenrolled_at: new Date().toISOString()
  });
}

async function forceUnenrollAgents(soClient, esClient, options) {
  // Filter to agents that are not already unenrolled
  const agents = 'agentIds' in options ? await (0, _crud.getAgents)(soClient, esClient, options.agentIds) : (await (0, _crud.listAllAgents)(soClient, esClient, {
    kuery: options.kuery,
    showInactive: false
  })).agents;
  const agentsToUpdate = agents.filter(agent => !agent.unenrolled_at);
  const now = new Date().toISOString();
  const apiKeys = []; // Get all API keys that need to be invalidated

  agentsToUpdate.forEach(agent => {
    if (agent.access_api_key_id) {
      apiKeys.push(agent.access_api_key_id);
    }

    if (agent.default_api_key_id) {
      apiKeys.push(agent.default_api_key_id);
    }
  }); // Invalidate all API keys

  if (apiKeys.length) {
    APIKeyService.invalidateAPIKeys(soClient, apiKeys);
  } // Update the necessary agents


  return (0, _crud.bulkUpdateAgents)(soClient, esClient, agentsToUpdate.map(agent => ({
    agentId: agent.id,
    data: {
      active: false,
      unenrolled_at: now
    }
  })));
}