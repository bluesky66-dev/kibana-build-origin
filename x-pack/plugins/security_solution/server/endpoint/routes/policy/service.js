"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getESQueryPolicyResponseByAgentID = getESQueryPolicyResponseByAgentID;
exports.getPolicyResponseByAgentId = getPolicyResponseByAgentId;
exports.getAgentPolicySummary = getAgentPolicySummary;
exports.agentVersionsMap = agentVersionsMap;

var _index = require("./index");

var _constants = require("../../../../../fleet/common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getESQueryPolicyResponseByAgentID(agentID, index) {
  return {
    body: {
      query: {
        bool: {
          filter: {
            term: {
              'agent.id': agentID
            }
          },
          must_not: {
            term: {
              'Endpoint.policy.applied.id': _index.INITIAL_POLICY_ID
            }
          }
        }
      },
      sort: [{
        'event.created': {
          order: 'desc'
        }
      }],
      size: 1
    },
    index
  };
}

async function getPolicyResponseByAgentId(index, agentID, dataClient) {
  const query = getESQueryPolicyResponseByAgentID(agentID, index);
  const response = await dataClient.callAsCurrentUser('search', query);

  if (response.hits.hits.length === 0) {
    return undefined;
  }

  return {
    policy_response: response.hits.hits[0]._source
  };
}

const transformAgentVersionMap = versionMap => {
  const data = {};
  versionMap.forEach((value, key) => {
    data[key] = value;
  });
  return data;
};

async function getAgentPolicySummary(endpointAppContext, soClient, esClient, packageName, policyId, pageSize = 1000) {
  const agentQuery = `${_constants.AGENT_SAVED_OBJECT_TYPE}.packages:"${packageName}"`;

  if (policyId) {
    return transformAgentVersionMap(await agentVersionsMap(endpointAppContext, soClient, esClient, `${agentQuery} AND ${_constants.AGENT_SAVED_OBJECT_TYPE}.policy_id:${policyId}`, pageSize));
  }

  return transformAgentVersionMap(await agentVersionsMap(endpointAppContext, soClient, esClient, agentQuery, pageSize));
}

async function agentVersionsMap(endpointAppContext, soClient, esClient, kqlQuery, pageSize = 1000) {
  const searchOptions = pageNum => {
    return {
      page: pageNum,
      perPage: pageSize,
      showInactive: false,
      kuery: kqlQuery
    };
  };

  let page = 1;
  const result = new Map();
  let hasMore = true;

  while (hasMore) {
    const queryResult = await endpointAppContext.service.getAgentService().listAgents(soClient, esClient, searchOptions(page++));
    queryResult.agents.forEach(agent => {
      var _agent$local_metadata, _agent$local_metadata2, _agent$local_metadata3;

      const agentVersion = (_agent$local_metadata = agent.local_metadata) === null || _agent$local_metadata === void 0 ? void 0 : (_agent$local_metadata2 = _agent$local_metadata.elastic) === null || _agent$local_metadata2 === void 0 ? void 0 : (_agent$local_metadata3 = _agent$local_metadata2.agent) === null || _agent$local_metadata3 === void 0 ? void 0 : _agent$local_metadata3.version;

      if (result.has(agentVersion)) {
        result.set(agentVersion, result.get(agentVersion) + 1);
      } else {
        result.set(agentVersion, 1);
      }
    });
    hasMore = queryResult.agents.length > 0;
  }

  return result;
}