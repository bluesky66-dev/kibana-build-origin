"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentStatusById = getAgentStatusById;
exports.getAgentStatusForAgentPolicy = getAgentStatusForAgentPolicy;
exports.getAgentStatus = void 0;

var _pMap = _interopRequireDefault(require("p-map"));

var _crud = require("./crud");

var _constants = require("../../constants");

var _services = require("../../../common/services");

var _server = require("../../../../../../src/plugins/data/server");

var _saved_object = require("../saved_object");

var _app_context = require("../app_context");

var _crud_fleet_server = require("./crud_fleet_server");

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


async function getAgentStatusById(soClient, esClient, agentId) {
  const agent = await (0, _crud.getAgent)(soClient, esClient, agentId);
  return _services.AgentStatusKueryHelper.getAgentStatus(agent);
}

const getAgentStatus = _services.AgentStatusKueryHelper.getAgentStatus;
exports.getAgentStatus = getAgentStatus;

function joinKuerys(...kuerys) {
  var _appContextService$ge, _appContextService$ge2;

  const isFleetServerEnabled = (_appContextService$ge = _app_context.appContextService.getConfig()) === null || _appContextService$ge === void 0 ? void 0 : (_appContextService$ge2 = _appContextService$ge.agents) === null || _appContextService$ge2 === void 0 ? void 0 : _appContextService$ge2.fleetServerEnabled;
  return kuerys.filter(kuery => kuery !== undefined).reduce((acc, kuery) => {
    if (kuery === undefined) {
      return acc;
    }

    const normalizedKuery = _server.esKuery.fromKueryExpression(isFleetServerEnabled ? (0, _crud_fleet_server.removeSOAttributes)(kuery || '') : (0, _saved_object.normalizeKuery)(_constants.AGENT_SAVED_OBJECT_TYPE, kuery || ''));

    if (!acc) {
      return normalizedKuery;
    }

    return {
      type: 'function',
      function: 'and',
      arguments: [acc, normalizedKuery]
    };
  }, undefined);
}

async function getAgentStatusForAgentPolicy(soClient, esClient, agentPolicyId, filterKuery) {
  const [all, online, error, offline, updating] = await (0, _pMap.default)([undefined, _services.AgentStatusKueryHelper.buildKueryForOnlineAgents(), _services.AgentStatusKueryHelper.buildKueryForErrorAgents(), _services.AgentStatusKueryHelper.buildKueryForOfflineAgents(), _services.AgentStatusKueryHelper.buildKueryForUpdatingAgents()], kuery => (0, _crud.listAgents)(soClient, esClient, {
    showInactive: false,
    perPage: 0,
    page: 1,
    kuery: joinKuerys(...[kuery, filterKuery, `${_constants.AGENT_SAVED_OBJECT_TYPE}.attributes.active:true`, agentPolicyId ? `${_constants.AGENT_SAVED_OBJECT_TYPE}.policy_id:"${agentPolicyId}"` : undefined])
  }), {
    concurrency: 1
  });
  return {
    events: await getEventsCount(soClient, agentPolicyId),
    total: all.total,
    online: online.total,
    error: error.total,
    offline: offline.total,
    updating: updating.total,
    other: all.total - online.total - error.total - offline.total
  };
}

async function getEventsCount(soClient, agentPolicyId) {
  const {
    total
  } = await soClient.find({
    type: _constants.AGENT_EVENT_SAVED_OBJECT_TYPE,
    searchFields: ['policy_id'],
    search: agentPolicyId,
    perPage: 0,
    page: 1,
    sortField: 'timestamp',
    sortOrder: 'desc',
    defaultSearchOperator: 'AND'
  });
  return total;
}