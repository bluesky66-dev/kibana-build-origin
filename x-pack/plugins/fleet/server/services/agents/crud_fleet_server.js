"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeSOAttributes = removeSOAttributes;
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

var _helpers = require("./helpers");

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


const ACTIVE_AGENT_CONDITION = 'active:true';
const INACTIVE_AGENT_CONDITION = `NOT (${ACTIVE_AGENT_CONDITION})`;

function _joinFilters(filters) {
  return filters.filter(filter => filter !== undefined).reduce((acc, kuery) => {
    if (kuery === undefined) {
      return acc;
    }

    const kueryNode = typeof kuery === 'string' ? _server.esKuery.fromKueryExpression(removeSOAttributes(kuery)) : kuery;

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

function removeSOAttributes(kuery) {
  return kuery.replace(/attributes\./g, '').replace(/fleet-agents\./g, '');
}

async function listAgents(esClient, options) {
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

  const kueryNode = _joinFilters(filters);

  const body = kueryNode ? {
    query: _server.esKuery.toElasticsearchQuery(kueryNode)
  } : {};
  const res = await esClient.search({
    index: _constants.AGENTS_INDEX,
    from: (page - 1) * perPage,
    size: perPage,
    sort: `${sortField}:${sortOrder}`,
    track_total_hits: true,
    body
  });
  let agentResults = res.body.hits.hits.map(_helpers.searchHitToAgent);
  let total = res.body.hits.total.value; // filtering for a range on the version string will not work,
  // nor does filtering on a flattened field (local_metadata), so filter here

  if (showUpgradeable) {
    agentResults = agentResults.filter(agent => (0, _common.isAgentUpgradeable)(agent, _services.appContextService.getKibanaVersion()));
    total = agentResults.length;
  }

  return {
    agents: res.body.hits.hits.map(_helpers.searchHitToAgent),
    total,
    page,
    perPage
  };
}

async function listAllAgents(esClient, options) {
  const res = await listAgents(esClient, { ...options,
    page: 1,
    perPage: _common.SO_SEARCH_LIMIT
  });
  return {
    agents: res.agents,
    total: res.total
  };
}

async function countInactiveAgents(esClient, options) {
  const {
    kuery
  } = options;
  const filters = [INACTIVE_AGENT_CONDITION];

  if (kuery && kuery !== '') {
    filters.push((0, _saved_object.normalizeKuery)(_constants.AGENT_SAVED_OBJECT_TYPE, kuery));
  }

  const kueryNode = _joinFilters(filters);

  const body = kueryNode ? {
    query: _server.esKuery.toElasticsearchQuery(kueryNode)
  } : {};
  const res = await esClient.search({
    index: _constants.AGENTS_INDEX,
    size: 0,
    track_total_hits: true,
    body
  });
  return res.body.hits.total.value;
}

async function getAgent(esClient, agentId) {
  const agentHit = await esClient.get({
    index: _constants.AGENTS_INDEX,
    id: agentId
  });
  const agent = (0, _helpers.searchHitToAgent)(agentHit.body);
  return agent;
}

async function getAgents(esClient, agentIds) {
  const body = {
    docs: agentIds.map(_id => ({
      _id
    }))
  };
  const res = await esClient.mget({
    body,
    index: _constants.AGENTS_INDEX
  });
  const agents = res.body.docs.map(_helpers.searchHitToAgent);
  return agents;
}

async function getAgentByAccessAPIKeyId(esClient, accessAPIKeyId) {
  const res = await esClient.search({
    index: _constants.AGENTS_INDEX,
    q: `access_api_key_id:${(0, _saved_object.escapeSearchQueryPhrase)(accessAPIKeyId)}`
  });
  const [agent] = res.body.hits.hits.map(_helpers.searchHitToAgent);

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

async function updateAgent(esClient, agentId, data) {
  await esClient.update({
    id: agentId,
    index: _constants.AGENTS_INDEX,
    body: {
      doc: (0, _helpers.agentSOAttributesToFleetServerAgentDoc)(data)
    },
    refresh: 'wait_for'
  });
}

async function bulkUpdateAgents(esClient, updateData) {
  const body = updateData.flatMap(({
    agentId,
    data
  }) => [{
    update: {
      _id: agentId
    }
  }, {
    doc: { ...(0, _helpers.agentSOAttributesToFleetServerAgentDoc)(data)
    }
  }]);
  const res = await esClient.bulk({
    body,
    index: _constants.AGENTS_INDEX,
    refresh: 'wait_for'
  });
  return {
    items: res.body.items.map(item => ({
      id: item.update._id,
      success: !item.update.error,
      error: item.update.error
    }))
  };
}

async function deleteAgent(esClient, agentId) {
  await esClient.update({
    id: agentId,
    index: _constants.AGENT_SAVED_OBJECT_TYPE,
    body: {
      doc: {
        active: false
      }
    }
  });
}