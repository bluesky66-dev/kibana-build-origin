"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.acknowledgeAgentActions = acknowledgeAgentActions;
exports.saveAgentEvents = saveAgentEvents;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lruCache = _interopRequireDefault(require("lru-cache"));

var _constants = require("../../constants");

var _actions = require("./actions");

var _unenroll = require("./unenroll");

var _upgrade = require("./upgrade");

var _crud = require("./crud");

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


const ALLOWED_ACKNOWLEDGEMENT_TYPE = ['ACTION_RESULT'];
const actionCache = new _lruCache.default({
  max: 20,
  maxAge: 10 * 60 * 1000 // 10 minutes

});

async function acknowledgeAgentActions(soClient, esClient, agent, agentEvents) {
  if (agentEvents.length === 0) {
    return [];
  }

  for (const agentEvent of agentEvents) {
    if (!isAllowedType(agentEvent.type)) {
      throw _boom.default.badRequest(`${agentEvent.type} not allowed for acknowledgment only ACTION_RESULT`);
    }
  }

  const actionIds = agentEvents.map(event => event.action_id).filter(actionId => actionId !== undefined);
  let actions;

  try {
    actions = await fetchActionsUsingCache(soClient, actionIds);
  } catch (error) {
    if (_boom.default.isBoom(error) && error.output.statusCode === 404) {
      throw _boom.default.badRequest(`One or more actions cannot be found`);
    }

    throw error;
  }

  const agentActionsIds = [];

  for (const action of actions) {
    if (action.agent_id) {
      agentActionsIds.push(action.id);
    }

    if (action.agent_id && action.agent_id !== agent.id) {
      throw _boom.default.badRequest(`${action.id} not found`);
    }
  }

  const isAgentUnenrolled = actions.some(action => action.type === 'UNENROLL');

  if (isAgentUnenrolled) {
    await (0, _unenroll.forceUnenrollAgent)(soClient, esClient, agent.id);
  }

  const upgradeAction = actions.find(action => action.type === 'UPGRADE');

  if (upgradeAction) {
    await (0, _upgrade.ackAgentUpgraded)(soClient, esClient, upgradeAction);
  }

  const configChangeAction = getLatestConfigChangePolicyActionIfUpdated(agent, actions);

  if (configChangeAction) {
    var _configChangeAction$a;

    await (0, _crud.updateAgent)(soClient, esClient, agent.id, {
      policy_revision: configChangeAction.policy_revision,
      packages: configChangeAction === null || configChangeAction === void 0 ? void 0 : (_configChangeAction$a = configChangeAction.ack_data) === null || _configChangeAction$a === void 0 ? void 0 : _configChangeAction$a.packages
    });
  }

  if (agentActionsIds.length > 0) {
    await soClient.bulkUpdate([...buildUpdateAgentActionSentAt(agentActionsIds)]);
  }

  return actions;
}

async function fetchActionsUsingCache(soClient, actionIds) {
  const missingActionIds = [];
  const actions = actionIds.map(actionId => {
    const action = actionCache.get(actionId);

    if (!action) {
      missingActionIds.push(actionId);
    }

    return action;
  }).filter(action => action !== undefined);

  if (missingActionIds.length === 0) {
    return actions;
  }

  const freshActions = await (0, _actions.getAgentActionByIds)(soClient, actionIds, false);
  freshActions.forEach(action => actionCache.set(action.id, action));
  return [...freshActions, ...actions];
}

function isAgentPolicyAction(action) {
  return action.policy_id !== undefined;
}

function getLatestConfigChangePolicyActionIfUpdated(agent, actions) {
  return actions.reduce((acc, action) => {
    var _action$policy_revisi;

    if (!isAgentPolicyAction(action) || action.type !== 'POLICY_CHANGE' && action.type !== 'CONFIG_CHANGE' || action.policy_id !== agent.policy_id || ((_action$policy_revisi = action === null || action === void 0 ? void 0 : action.policy_revision) !== null && _action$policy_revisi !== void 0 ? _action$policy_revisi : 0) < (agent.policy_revision || 0)) {
      return acc;
    }

    return action;
  }, null);
}

function buildUpdateAgentActionSentAt(actionsIds, sentAt = new Date().toISOString()) {
  return actionsIds.map(actionId => ({
    type: _constants.AGENT_ACTION_SAVED_OBJECT_TYPE,
    id: actionId,
    attributes: {
      sent_at: sentAt
    }
  }));
}

function isAllowedType(eventType) {
  return ALLOWED_ACKNOWLEDGEMENT_TYPE.indexOf(eventType) >= 0;
}

async function saveAgentEvents(soClient, events) {
  const objects = events.map(eventData => {
    return {
      attributes: { ...eventData,
        payload: eventData.payload ? JSON.stringify(eventData.payload) : undefined
      },
      type: _constants.AGENT_EVENT_SAVED_OBJECT_TYPE
    };
  });
  return await soClient.bulkCreate(objects);
}