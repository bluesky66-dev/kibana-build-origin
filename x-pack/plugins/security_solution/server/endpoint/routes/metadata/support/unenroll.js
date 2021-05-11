"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAllUnenrolledAgentIds = findAllUnenrolledAgentIds;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function findAllUnenrolledAgentIds(agentService, soClient, esClient, pageSize = 1000) {
  const searchOptions = pageNum => {
    return {
      page: pageNum,
      perPage: pageSize,
      showInactive: true,
      kuery: '(fleet-agents.active : false) OR (NOT fleet-agents.packages : "endpoint" AND fleet-agents.active : true)'
    };
  };

  let page = 1;
  const result = [];
  let hasMore = true;

  while (hasMore) {
    const unenrolledAgents = await agentService.listAgents(soClient, esClient, searchOptions(page++));
    result.push(...unenrolledAgents.agents.map(agent => agent.id));
    hasMore = unenrolledAgents.agents.length > 0;
  }

  return result;
}