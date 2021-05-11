"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.agentCheckinState = void 0;

var _app_context = require("../../app_context");

var _state_connected_agents = require("./state_connected_agents");

var _state_new_actions = require("./state_new_actions");

var _constants = require("../../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function agentCheckinStateFactory() {
  const agentConnected = (0, _state_connected_agents.agentCheckinStateConnectedAgentsFactory)();
  let newActions;
  let interval;

  function start() {
    newActions = (0, _state_new_actions.agentCheckinStateNewActionsFactory)();
    interval = setInterval(async () => {
      try {
        await agentConnected.updateLastCheckinAt();
      } catch (err) {
        _app_context.appContextService.getLogger().error(err);
      }
    }, _constants.AGENT_UPDATE_LAST_CHECKIN_INTERVAL_MS);
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
    }
  }

  return {
    subscribeToNewActions: async (soClient, esClient, agent, options) => {
      if (!newActions) {
        throw new Error('Agent checkin state not initialized');
      }

      return agentConnected.wrapPromise(agent.id, newActions.subscribeToNewActions(soClient, esClient, agent, options));
    },
    start,
    stop
  };
}

const agentCheckinState = agentCheckinStateFactory();
exports.agentCheckinState = agentCheckinState;