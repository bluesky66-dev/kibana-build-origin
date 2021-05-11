"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listAgents = listAgents;
exports.listAllAgents = listAllAgents;
exports.countInactiveAgents = countInactiveAgents;
exports.getAgent = getAgent;
exports.getAgents = getAgents;
exports.getAgentPolicyForAgent = getAgentPolicyForAgent;
exports.getAgentByAccessAPIKeyId = getAgentByAccessAPIKeyId;
exports.updateAgent = updateAgent;
exports.bulkUpdateAgents = bulkUpdateAgents;
exports.deleteAgent = deleteAgent;

var _services = require("../../services");

var crudServiceSO = _interopRequireWildcard(require("./crud_so"));

var crudServiceFleetServer = _interopRequireWildcard(require("./crud_fleet_server"));

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


async function listAgents(soClient, esClient, options) {
  var _appContextService$ge, _appContextService$ge2;

  const fleetServerEnabled = (_appContextService$ge = _services.appContextService.getConfig()) === null || _appContextService$ge === void 0 ? void 0 : (_appContextService$ge2 = _appContextService$ge.agents) === null || _appContextService$ge2 === void 0 ? void 0 : _appContextService$ge2.fleetServerEnabled;
  return fleetServerEnabled ? crudServiceFleetServer.listAgents(esClient, options) : crudServiceSO.listAgents(soClient, options);
}

async function listAllAgents(soClient, esClient, options) {
  var _appContextService$ge3, _appContextService$ge4;

  const fleetServerEnabled = (_appContextService$ge3 = _services.appContextService.getConfig()) === null || _appContextService$ge3 === void 0 ? void 0 : (_appContextService$ge4 = _appContextService$ge3.agents) === null || _appContextService$ge4 === void 0 ? void 0 : _appContextService$ge4.fleetServerEnabled;
  return fleetServerEnabled ? crudServiceFleetServer.listAllAgents(esClient, options) : crudServiceSO.listAllAgents(soClient, options);
}

async function countInactiveAgents(soClient, esClient, options) {
  var _appContextService$ge5, _appContextService$ge6;

  const fleetServerEnabled = (_appContextService$ge5 = _services.appContextService.getConfig()) === null || _appContextService$ge5 === void 0 ? void 0 : (_appContextService$ge6 = _appContextService$ge5.agents) === null || _appContextService$ge6 === void 0 ? void 0 : _appContextService$ge6.fleetServerEnabled;
  return fleetServerEnabled ? crudServiceFleetServer.countInactiveAgents(esClient, options) : crudServiceSO.countInactiveAgents(soClient, options);
}

async function getAgent(soClient, esClient, agentId) {
  var _appContextService$ge7, _appContextService$ge8;

  const fleetServerEnabled = (_appContextService$ge7 = _services.appContextService.getConfig()) === null || _appContextService$ge7 === void 0 ? void 0 : (_appContextService$ge8 = _appContextService$ge7.agents) === null || _appContextService$ge8 === void 0 ? void 0 : _appContextService$ge8.fleetServerEnabled;
  return fleetServerEnabled ? crudServiceFleetServer.getAgent(esClient, agentId) : crudServiceSO.getAgent(soClient, agentId);
}

async function getAgents(soClient, esClient, agentIds) {
  var _appContextService$ge9, _appContextService$ge10;

  const fleetServerEnabled = (_appContextService$ge9 = _services.appContextService.getConfig()) === null || _appContextService$ge9 === void 0 ? void 0 : (_appContextService$ge10 = _appContextService$ge9.agents) === null || _appContextService$ge10 === void 0 ? void 0 : _appContextService$ge10.fleetServerEnabled;
  return fleetServerEnabled ? crudServiceFleetServer.getAgents(esClient, agentIds) : crudServiceSO.getAgents(soClient, agentIds);
}

async function getAgentPolicyForAgent(soClient, esClient, agentId) {
  const agent = await getAgent(soClient, esClient, agentId);

  if (!agent.policy_id) {
    return;
  }

  const agentPolicy = await _services.agentPolicyService.get(soClient, agent.policy_id, false);

  if (agentPolicy) {
    return agentPolicy;
  }
}

async function getAgentByAccessAPIKeyId(soClient, esClient, accessAPIKeyId) {
  var _appContextService$ge11, _appContextService$ge12;

  const fleetServerEnabled = (_appContextService$ge11 = _services.appContextService.getConfig()) === null || _appContextService$ge11 === void 0 ? void 0 : (_appContextService$ge12 = _appContextService$ge11.agents) === null || _appContextService$ge12 === void 0 ? void 0 : _appContextService$ge12.fleetServerEnabled;
  return fleetServerEnabled ? crudServiceFleetServer.getAgentByAccessAPIKeyId(esClient, accessAPIKeyId) : crudServiceSO.getAgentByAccessAPIKeyId(soClient, accessAPIKeyId);
}

async function updateAgent(soClient, esClient, agentId, data) {
  var _appContextService$ge13, _appContextService$ge14;

  const fleetServerEnabled = (_appContextService$ge13 = _services.appContextService.getConfig()) === null || _appContextService$ge13 === void 0 ? void 0 : (_appContextService$ge14 = _appContextService$ge13.agents) === null || _appContextService$ge14 === void 0 ? void 0 : _appContextService$ge14.fleetServerEnabled;
  return fleetServerEnabled ? crudServiceFleetServer.updateAgent(esClient, agentId, data) : crudServiceSO.updateAgent(soClient, agentId, data);
}

async function bulkUpdateAgents(soClient, esClient, data) {
  var _appContextService$ge15, _appContextService$ge16;

  const fleetServerEnabled = (_appContextService$ge15 = _services.appContextService.getConfig()) === null || _appContextService$ge15 === void 0 ? void 0 : (_appContextService$ge16 = _appContextService$ge15.agents) === null || _appContextService$ge16 === void 0 ? void 0 : _appContextService$ge16.fleetServerEnabled;
  return fleetServerEnabled ? crudServiceFleetServer.bulkUpdateAgents(esClient, data) : crudServiceSO.bulkUpdateAgents(soClient, data);
}

async function deleteAgent(soClient, esClient, agentId) {
  var _appContextService$ge17, _appContextService$ge18;

  const fleetServerEnabled = (_appContextService$ge17 = _services.appContextService.getConfig()) === null || _appContextService$ge17 === void 0 ? void 0 : (_appContextService$ge18 = _appContextService$ge17.agents) === null || _appContextService$ge18 === void 0 ? void 0 : _appContextService$ge18.fleetServerEnabled;
  return fleetServerEnabled ? crudServiceFleetServer.deleteAgent(esClient, agentId) : crudServiceSO.deleteAgent(soClient, agentId);
}