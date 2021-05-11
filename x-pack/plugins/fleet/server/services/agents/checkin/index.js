"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.agentCheckin = agentCheckin;

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _constants = require("../../../constants");

var _state = require("./state");

var _actions = require("../actions");

var _crud = require("../crud");

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


async function agentCheckin(soClient, esClient, agent, data, options) {
  const updateData = {};
  await processEventsForCheckin(soClient, agent, data.events);

  if (data.localMetadata && !(0, _fastDeepEqual.default)(data.localMetadata, agent.local_metadata)) {
    updateData.local_metadata = data.localMetadata;
  }

  if (data.status !== agent.last_checkin_status) {
    updateData.last_checkin_status = data.status;
  } // Update agent only if something changed


  if (Object.keys(updateData).length > 0) {
    await (0, _crud.updateAgent)(soClient, esClient, agent.id, updateData);
  } // Check if some actions are not acknowledged


  let actions = await (0, _actions.getAgentActionsForCheckin)(soClient, agent.id);

  if (actions.length > 0) {
    return {
      actions
    };
  } // Wait for new actions


  actions = await _state.agentCheckinState.subscribeToNewActions(soClient, esClient, agent, options);
  return {
    actions
  };
}

async function processEventsForCheckin(soClient, agent, events) {
  const updatedErrorEvents = [...agent.current_error_events];

  for (const event of events) {
    // @ts-ignore
    event.policy_id = agent.policy_id;

    if (isErrorOrState(event)) {
      // Remove any global or specific to a stream event
      const existingEventIndex = updatedErrorEvents.findIndex(e => e.stream_id === event.stream_id);

      if (existingEventIndex >= 0) {
        updatedErrorEvents.splice(existingEventIndex, 1);
      }

      if (event.type === 'ERROR') {
        updatedErrorEvents.push(event);
      }
    }
  }

  if (events.length > 0) {
    await createEventsForAgent(soClient, agent.id, events);
  }

  return {
    updatedErrorEvents
  };
}

async function createEventsForAgent(soClient, agentId, events) {
  const objects = events.map(eventData => {
    return {
      attributes: { ...eventData,
        payload: eventData.payload ? JSON.stringify(eventData.payload) : undefined
      },
      type: _constants.AGENT_EVENT_SAVED_OBJECT_TYPE
    };
  });
  return soClient.bulkCreate(objects);
}

function isErrorOrState(event) {
  return event.type === 'STATE' || event.type === 'ERROR';
}