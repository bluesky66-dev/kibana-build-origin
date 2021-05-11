"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.agentCheckinStateConnectedAgentsFactory = agentCheckinStateConnectedAgentsFactory;

var _app_context = require("../../app_context");

var _crud = require("../crud");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getInternalUserSOClient() {
  const fakeRequest = {
    headers: {},
    getBasePath: () => '',
    path: '/',
    route: {
      settings: {}
    },
    url: {
      href: '/'
    },
    raw: {
      req: {
        url: '/'
      }
    }
  };
  return _app_context.appContextService.getInternalUserSOClient(fakeRequest);
}

function agentCheckinStateConnectedAgentsFactory() {
  const connectedAgentsIds = new Set();
  let agentToUpdate = new Set();

  function addAgent(agentId) {
    connectedAgentsIds.add(agentId);
    agentToUpdate.add(agentId);
  }

  function removeAgent(agentId) {
    connectedAgentsIds.delete(agentId);
  }

  async function wrapPromise(agentId, p) {
    try {
      addAgent(agentId);
      const res = await p;
      removeAgent(agentId);
      return res;
    } catch (err) {
      removeAgent(agentId);
      throw err;
    }
  }

  async function updateLastCheckinAt() {
    if (agentToUpdate.size === 0) {
      return;
    }

    const esClient = _app_context.appContextService.getInternalUserESClient();

    const internalSOClient = getInternalUserSOClient();
    const now = new Date().toISOString();
    const updates = [...agentToUpdate.values()].map(agentId => ({
      agentId,
      data: {
        last_checkin: now
      }
    }));
    agentToUpdate = new Set([...connectedAgentsIds.values()]);
    await (0, _crud.bulkUpdateAgents)(internalSOClient, esClient, updates);
  }

  return {
    wrapPromise,
    updateLastCheckinAt
  };
}