"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unenrollForAgentPolicyId = unenrollForAgentPolicyId;

var _crud = require("./crud");

var _constants = require("../../constants");

var _unenroll = require("./unenroll");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function unenrollForAgentPolicyId(soClient, esClient, policyId) {
  let hasMore = true;
  let page = 1;

  while (hasMore) {
    const {
      agents
    } = await (0, _crud.listAgents)(soClient, esClient, {
      kuery: `${_constants.AGENT_SAVED_OBJECT_TYPE}.policy_id:"${policyId}"`,
      page: page++,
      perPage: 1000,
      showInactive: true
    });

    if (agents.length === 0) {
      hasMore = false;
    }

    for (const agent of agents) {
      await (0, _unenroll.unenrollAgent)(soClient, esClient, agent.id);
    }
  }
}