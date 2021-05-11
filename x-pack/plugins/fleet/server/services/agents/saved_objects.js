"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectToAgent = savedObjectToAgent;
exports.savedObjectToAgentAction = savedObjectToAgentAction;
exports.isAgentActionSavedObject = isAgentActionSavedObject;
exports.isPolicyActionSavedObject = isPolicyActionSavedObject;

var _boom = _interopRequireDefault(require("@hapi/boom"));

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


function savedObjectToAgent(so) {
  var _so$attributes$packag;

  if (so.error) {
    throw new Error(so.error.message);
  }

  return {
    id: so.id,
    ...so.attributes,
    current_error_events: so.attributes.current_error_events ? JSON.parse(so.attributes.current_error_events) : [],
    local_metadata: so.attributes.local_metadata,
    user_provided_metadata: so.attributes.user_provided_metadata,
    access_api_key: undefined,
    status: undefined,
    packages: (_so$attributes$packag = so.attributes.packages) !== null && _so$attributes$packag !== void 0 ? _so$attributes$packag : []
  };
}

function savedObjectToAgentAction(so) {
  if (so.error) {
    if (so.error.statusCode === 404) {
      throw _boom.default.notFound(so.error.message);
    }

    throw new Error(so.error.message);
  } // If it's an AgentPolicyAction


  if (isPolicyActionSavedObject(so)) {
    return {
      id: so.id,
      type: so.attributes.type,
      created_at: so.attributes.created_at,
      policy_id: so.attributes.policy_id,
      policy_revision: so.attributes.policy_revision,
      data: so.attributes.data ? JSON.parse(so.attributes.data) : undefined,
      ack_data: so.attributes.ack_data ? JSON.parse(so.attributes.ack_data) : undefined
    };
  }

  if (!isAgentActionSavedObject(so)) {
    throw new Error(`Malformed saved object AgentAction ${so.id}`);
  } // If it's an AgentAction


  return {
    id: so.id,
    type: so.attributes.type,
    created_at: so.attributes.created_at,
    agent_id: so.attributes.agent_id,
    data: so.attributes.data ? JSON.parse(so.attributes.data) : undefined,
    ack_data: so.attributes.ack_data ? JSON.parse(so.attributes.ack_data) : undefined
  };
}

function isAgentActionSavedObject(so) {
  return so.attributes.agent_id !== undefined;
}

function isPolicyActionSavedObject(so) {
  return so.attributes.policy_id !== undefined;
}