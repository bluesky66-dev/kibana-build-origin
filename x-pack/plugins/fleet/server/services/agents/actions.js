"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAgentAction = createAgentAction;
exports.bulkCreateAgentActions = bulkCreateAgentActions;
exports.createAgentPolicyAction = createAgentPolicyAction;
exports.getAgentActionsForCheckin = getAgentActionsForCheckin;
exports.getAgentActionByIds = getAgentActionByIds;
exports.getAgentPolicyActionByIds = getAgentPolicyActionByIds;
exports.getNewActionsSince = getNewActionsSince;
exports.getLatestConfigChangeAction = getLatestConfigChangeAction;

var _constants = require("../../../common/constants");

var _saved_objects = require("./saved_objects");

var _app_context = require("../app_context");

var _common = require("../../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ONE_MONTH_IN_MS = 2592000000;

async function createAgentAction(soClient, esClient, newAgentAction) {
  return createAction(soClient, esClient, newAgentAction);
}

async function bulkCreateAgentActions(soClient, esClient, newAgentActions) {
  return bulkCreateActions(soClient, esClient, newAgentActions);
}

function createAgentPolicyAction(soClient, esClient, newAgentAction) {
  return createAction(soClient, esClient, newAgentAction);
}

async function createAction(soClient, esClient, newAgentAction) {
  var _appContextService$ge, _appContextService$ge2;

  const actionSO = await soClient.create(_constants.AGENT_ACTION_SAVED_OBJECT_TYPE, { ...newAgentAction,
    data: newAgentAction.data ? JSON.stringify(newAgentAction.data) : undefined,
    ack_data: newAgentAction.ack_data ? JSON.stringify(newAgentAction.ack_data) : undefined
  });

  if ((_appContextService$ge = _app_context.appContextService.getConfig()) !== null && _appContextService$ge !== void 0 && (_appContextService$ge2 = _appContextService$ge.agents) !== null && _appContextService$ge2 !== void 0 && _appContextService$ge2.fleetServerEnabled && (0, _saved_objects.isAgentActionSavedObject)(actionSO)) {
    const body = {
      '@timestamp': new Date().toISOString(),
      expiration: new Date(Date.now() + ONE_MONTH_IN_MS).toISOString(),
      agents: [actionSO.attributes.agent_id],
      action_id: actionSO.id,
      data: newAgentAction.data,
      type: newAgentAction.type
    };
    await esClient.create({
      index: _constants.AGENT_ACTIONS_INDEX,
      id: actionSO.id,
      body,
      refresh: 'wait_for'
    });
  }

  if ((0, _saved_objects.isAgentActionSavedObject)(actionSO)) {
    const agentAction = (0, _saved_objects.savedObjectToAgentAction)(actionSO); // Action `data` is encrypted, so is not returned from the saved object
    // so we add back the original value from the request to form the expected
    // response shape for POST create agent action endpoint

    agentAction.data = newAgentAction.data;
    return agentAction;
  } else if ((0, _saved_objects.isPolicyActionSavedObject)(actionSO)) {
    const agentAction = (0, _saved_objects.savedObjectToAgentAction)(actionSO);
    agentAction.data = newAgentAction.data;
    return agentAction;
  }

  throw new Error('Invalid action');
}

async function bulkCreateActions(soClient, esClient, newAgentActions) {
  var _appContextService$ge3, _appContextService$ge4;

  const {
    saved_objects: actionSOs
  } = await soClient.bulkCreate(newAgentActions.map(newAgentAction => ({
    type: _constants.AGENT_ACTION_SAVED_OBJECT_TYPE,
    attributes: { ...newAgentAction,
      data: newAgentAction.data ? JSON.stringify(newAgentAction.data) : undefined,
      ack_data: newAgentAction.ack_data ? JSON.stringify(newAgentAction.ack_data) : undefined
    }
  })));

  if ((_appContextService$ge3 = _app_context.appContextService.getConfig()) !== null && _appContextService$ge3 !== void 0 && (_appContextService$ge4 = _appContextService$ge3.agents) !== null && _appContextService$ge4 !== void 0 && _appContextService$ge4.fleetServerEnabled) {
    await esClient.bulk({
      index: _constants.AGENT_ACTIONS_INDEX,
      body: actionSOs.flatMap(actionSO => {
        if (!(0, _saved_objects.isAgentActionSavedObject)(actionSO)) {
          return [];
        }

        const body = {
          '@timestamp': new Date().toISOString(),
          expiration: new Date(Date.now() + ONE_MONTH_IN_MS).toISOString(),
          agents: [actionSO.attributes.agent_id],
          action_id: actionSO.id,
          data: actionSO.attributes.data ? JSON.parse(actionSO.attributes.data) : undefined,
          type: actionSO.type
        };
        return [{
          create: {
            _id: actionSO.id
          }
        }, body];
      })
    });
  }

  return actionSOs.map(actionSO => {
    if ((0, _saved_objects.isAgentActionSavedObject)(actionSO)) {
      const agentAction = (0, _saved_objects.savedObjectToAgentAction)(actionSO); // Compared to single create (createAction()), we don't add back the
      // original value of `agentAction.data` as this method isn't exposed
      // via an HTTP endpoint

      return agentAction;
    } else if ((0, _saved_objects.isPolicyActionSavedObject)(actionSO)) {
      const agentAction = (0, _saved_objects.savedObjectToAgentAction)(actionSO);
      return agentAction;
    }

    throw new Error('Invalid action');
  });
}

async function getAgentActionsForCheckin(soClient, agentId) {
  const filter = _common.nodeTypes.function.buildNode('and', [_common.nodeTypes.function.buildNode('not', _common.nodeTypes.function.buildNodeWithArgumentNodes('is', [_common.nodeTypes.literal.buildNode(`${_constants.AGENT_ACTION_SAVED_OBJECT_TYPE}.attributes.sent_at`), _common.nodeTypes.wildcard.buildNode(_common.nodeTypes.wildcard.wildcardSymbol), _common.nodeTypes.literal.buildNode(false)])), _common.nodeTypes.function.buildNode('not', _common.nodeTypes.function.buildNodeWithArgumentNodes('is', [_common.nodeTypes.literal.buildNode(`${_constants.AGENT_ACTION_SAVED_OBJECT_TYPE}.attributes.type`), _common.nodeTypes.literal.buildNode('INTERNAL_POLICY_REASSIGN'), _common.nodeTypes.literal.buildNode(false)])), _common.nodeTypes.function.buildNodeWithArgumentNodes('is', [_common.nodeTypes.literal.buildNode(`${_constants.AGENT_ACTION_SAVED_OBJECT_TYPE}.attributes.agent_id`), _common.nodeTypes.literal.buildNode(agentId), _common.nodeTypes.literal.buildNode(false)])]);

  const res = await soClient.find({
    type: _constants.AGENT_ACTION_SAVED_OBJECT_TYPE,
    filter
  });
  return Promise.all(res.saved_objects.map(async so => {
    // Get decrypted actions
    return (0, _saved_objects.savedObjectToAgentAction)(await _app_context.appContextService.getEncryptedSavedObjects().getDecryptedAsInternalUser(_constants.AGENT_ACTION_SAVED_OBJECT_TYPE, so.id));
  }));
}

async function getAgentActionByIds(soClient, actionIds, decryptData = true) {
  const actions = (await soClient.bulkGet(actionIds.map(actionId => ({
    id: actionId,
    type: _constants.AGENT_ACTION_SAVED_OBJECT_TYPE
  })))).saved_objects.map(action => (0, _saved_objects.savedObjectToAgentAction)(action));

  if (!decryptData) {
    return actions;
  }

  return Promise.all(actions.map(async action => {
    // Get decrypted actions
    return (0, _saved_objects.savedObjectToAgentAction)(await _app_context.appContextService.getEncryptedSavedObjects().getDecryptedAsInternalUser(_constants.AGENT_ACTION_SAVED_OBJECT_TYPE, action.id));
  }));
}

async function getAgentPolicyActionByIds(soClient, actionIds, decryptData = true) {
  const actions = (await soClient.bulkGet(actionIds.map(actionId => ({
    id: actionId,
    type: _constants.AGENT_ACTION_SAVED_OBJECT_TYPE
  })))).saved_objects.map(action => (0, _saved_objects.savedObjectToAgentAction)(action));

  if (!decryptData) {
    return actions;
  }

  return Promise.all(actions.map(async action => {
    // Get decrypted actions
    return (0, _saved_objects.savedObjectToAgentAction)(await _app_context.appContextService.getEncryptedSavedObjects().getDecryptedAsInternalUser(_constants.AGENT_ACTION_SAVED_OBJECT_TYPE, action.id));
  }));
}

async function getNewActionsSince(soClient, timestamp, decryptData = true) {
  const filter = _common.nodeTypes.function.buildNode('and', [_common.nodeTypes.function.buildNode('not', _common.nodeTypes.function.buildNodeWithArgumentNodes('is', [_common.nodeTypes.literal.buildNode(`${_constants.AGENT_ACTION_SAVED_OBJECT_TYPE}.attributes.sent_at`), _common.nodeTypes.wildcard.buildNode(_common.nodeTypes.wildcard.wildcardSymbol), _common.nodeTypes.literal.buildNode(false)])), _common.nodeTypes.function.buildNodeWithArgumentNodes('is', [_common.nodeTypes.literal.buildNode(`${_constants.AGENT_ACTION_SAVED_OBJECT_TYPE}.attributes.agent_id`), _common.nodeTypes.wildcard.buildNode(_common.nodeTypes.wildcard.wildcardSymbol), _common.nodeTypes.literal.buildNode(false)]), _common.nodeTypes.function.buildNode('range', `${_constants.AGENT_ACTION_SAVED_OBJECT_TYPE}.attributes.created_at`, {
    gt: timestamp
  })]);

  const actions = (await soClient.find({
    type: _constants.AGENT_ACTION_SAVED_OBJECT_TYPE,
    filter
  })).saved_objects.filter(_saved_objects.isAgentActionSavedObject).map(so => (0, _saved_objects.savedObjectToAgentAction)(so));

  if (!decryptData) {
    return actions;
  }

  return await Promise.all(actions.map(async action => {
    // Get decrypted actions
    return (0, _saved_objects.savedObjectToAgentAction)(await _app_context.appContextService.getEncryptedSavedObjects().getDecryptedAsInternalUser(_constants.AGENT_ACTION_SAVED_OBJECT_TYPE, action.id));
  }));
}

async function getLatestConfigChangeAction(soClient, policyId) {
  const res = await soClient.find({
    type: _constants.AGENT_ACTION_SAVED_OBJECT_TYPE,
    search: policyId,
    searchFields: ['policy_id'],
    sortField: 'created_at',
    sortOrder: 'DESC'
  });

  if (res.saved_objects[0]) {
    return (0, _saved_objects.savedObjectToAgentAction)(res.saved_objects[0]);
  }
}