"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listAgents = listAgents;
exports.listAllAgents = listAllAgents;
exports.countInactiveAgents = countInactiveAgents;
exports.getAgent = getAgent;
exports.getAgents = getAgents;
exports.getAgentByAccessAPIKeyId = getAgentByAccessAPIKeyId;
exports.updateAgent = updateAgent;
exports.bulkUpdateAgents = bulkUpdateAgents;
exports.deleteAgent = deleteAgent;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _common = require("../../../common");

var _constants = require("../../constants");

var _saved_object = require("../saved_object");

var _saved_objects = require("./saved_objects");

var _services = require("../../services");

var _server = require("../../../../../../src/plugins/data/server");

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


const ACTIVE_AGENT_CONDITION = `${_constants.AGENT_SAVED_OBJECT_TYPE}.attributes.active:true`;
const INACTIVE_AGENT_CONDITION = `NOT (${ACTIVE_AGENT_CONDITION})`;

function _joinFilters(filters) {
  return filters.filter(filter => filter !== undefined).reduce((acc, kuery) => {
    if (kuery === undefined) {
      return acc;
    }

    const kueryNode = typeof kuery === 'string' ? _server.esKuery.fromKueryExpression((0, _saved_object.normalizeKuery)(_constants.AGENT_SAVED_OBJECT_TYPE, kuery)) : kuery;

    if (!acc) {
      return kueryNode;
    }

    return {
      type: 'function',
      function: 'and',
      arguments: [acc, kueryNode]
    };
  }, undefined);
}

async function listAgents(soClient, options) {
  const {
    page = 1,
    perPage = 20,
    sortField = 'enrolled_at',
    sortOrder = 'desc',
    kuery,
    showInactive = false,
    showUpgradeable
  } = options;
  const filters = [];

  if (kuery && kuery !== '') {
    filters.push(kuery);
  }

  if (showInactive === false) {
    filters.push(ACTIVE_AGENT_CONDITION);
  }

  try {
    let {
      saved_objects: agentSOs,
      total
    } = await soClient.find({
      type: _constants.AGENT_SAVED_OBJECT_TYPE,
      filter: _joinFilters(filters) || '',
      sortField,
      sortOrder,
      page,
      perPage
    }); // filtering for a range on the version string will not work,
    // nor does filtering on a flattened field (local_metadata), so filter here

    if (showUpgradeable) {
      agentSOs = agentSOs.filter(agent => (0, _common.isAgentUpgradeable)((0, _saved_objects.savedObjectToAgent)(agent), _services.appContextService.getKibanaVersion()));
      total = agentSOs.length;
    }

    return {
      agents: agentSOs.map(_saved_objects.savedObjectToAgent),
      total,
      page,
      perPage
    };
  } catch (e) {
    var _e$output, _e$output$payload, _e$output$payload$mes;

    if ((_e$output = e.output) !== null && _e$output !== void 0 && (_e$output$payload = _e$output.payload) !== null && _e$output$payload !== void 0 && (_e$output$payload$mes = _e$output$payload.message) !== null && _e$output$payload$mes !== void 0 && _e$output$payload$mes.startsWith('The key is empty')) {
      return {
        agents: [],
        total: 0,
        page: 0,
        perPage: 0
      };
    } else {
      throw e;
    }
  }
}

async function listAllAgents(soClient, options) {
  const {
    sortField = 'enrolled_at',
    sortOrder = 'desc',
    kuery,
    showInactive = false
  } = options;
  const filters = [];

  if (kuery && kuery !== '') {
    filters.push(kuery);
  }

  if (showInactive === false) {
    filters.push(ACTIVE_AGENT_CONDITION);
  }

  const {
    saved_objects: agentSOs,
    total
  } = await (0, _saved_object.findAllSOs)(soClient, {
    type: _constants.AGENT_SAVED_OBJECT_TYPE,
    kuery: _joinFilters(filters),
    sortField,
    sortOrder
  });
  return {
    agents: agentSOs.map(_saved_objects.savedObjectToAgent),
    total
  };
}

async function countInactiveAgents(soClient, options) {
  const {
    kuery
  } = options;
  const filters = [INACTIVE_AGENT_CONDITION];

  if (kuery && kuery !== '') {
    filters.push((0, _saved_object.normalizeKuery)(_constants.AGENT_SAVED_OBJECT_TYPE, kuery));
  }

  const {
    total
  } = await soClient.find({
    type: _constants.AGENT_SAVED_OBJECT_TYPE,
    filter: _joinFilters(filters),
    perPage: 0
  });
  return total;
}

async function getAgent(soClient, agentId) {
  const agent = (0, _saved_objects.savedObjectToAgent)(await soClient.get(_constants.AGENT_SAVED_OBJECT_TYPE, agentId));
  return agent;
}

async function getAgents(soClient, agentIds) {
  const agentSOs = await soClient.bulkGet(agentIds.map(agentId => ({
    id: agentId,
    type: _constants.AGENT_SAVED_OBJECT_TYPE
  })));
  const agents = agentSOs.saved_objects.map(_saved_objects.savedObjectToAgent);
  return agents;
}

async function getAgentByAccessAPIKeyId(soClient, accessAPIKeyId) {
  const response = await soClient.find({
    type: _constants.AGENT_SAVED_OBJECT_TYPE,
    searchFields: ['access_api_key_id'],
    search: (0, _saved_object.escapeSearchQueryPhrase)(accessAPIKeyId)
  });
  const [agent] = response.saved_objects.map(_saved_objects.savedObjectToAgent);

  if (!agent) {
    throw _boom.default.notFound('Agent not found');
  }

  if (agent.access_api_key_id !== accessAPIKeyId) {
    throw new Error('Agent api key id is not matching');
  }

  if (!agent.active) {
    throw _boom.default.forbidden('Agent inactive');
  }

  return agent;
}

async function updateAgent(soClient, agentId, data) {
  await soClient.update(_constants.AGENT_SAVED_OBJECT_TYPE, agentId, data);
}

async function bulkUpdateAgents(soClient, updateData) {
  const updates = updateData.map(({
    agentId,
    data
  }) => ({
    type: _constants.AGENT_SAVED_OBJECT_TYPE,
    id: agentId,
    attributes: data
  }));
  const res = await soClient.bulkUpdate(updates);
  return {
    items: res.saved_objects.map(so => ({
      id: so.id,
      success: !so.error,
      error: so.error
    }))
  };
}

async function deleteAgent(soClient, agentId) {
  await soClient.update(_constants.AGENT_SAVED_OBJECT_TYPE, agentId, {
    active: false
  });
}