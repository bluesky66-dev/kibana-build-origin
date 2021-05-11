"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewAgentActionSchema = exports.AgentEventSchema = exports.NewAgentEventSchema = exports.AckEventSchema = exports.AgentTypeSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const AgentTypeSchema = _configSchema.schema.oneOf([_configSchema.schema.literal(_common.AGENT_TYPE_EPHEMERAL), _configSchema.schema.literal(_common.AGENT_TYPE_PERMANENT), _configSchema.schema.literal(_common.AGENT_TYPE_TEMPORARY)]);

exports.AgentTypeSchema = AgentTypeSchema;
const AgentEventBase = {
  type: _configSchema.schema.oneOf([_configSchema.schema.literal('STATE'), _configSchema.schema.literal('ERROR'), _configSchema.schema.literal('ACTION_RESULT'), _configSchema.schema.literal('ACTION')]),
  subtype: _configSchema.schema.oneOf([// State
  _configSchema.schema.oneOf([_configSchema.schema.literal('RUNNING'), _configSchema.schema.literal('STARTING'), _configSchema.schema.literal('IN_PROGRESS'), _configSchema.schema.literal('CONFIG'), _configSchema.schema.literal('FAILED'), _configSchema.schema.literal('STOPPING'), _configSchema.schema.literal('STOPPED'), _configSchema.schema.literal('DEGRADED'), _configSchema.schema.literal('UPDATING')]), // Action results
  _configSchema.schema.literal('DATA_DUMP'), // Actions
  _configSchema.schema.literal('ACKNOWLEDGED'), _configSchema.schema.literal('UNKNOWN')]),
  timestamp: _configSchema.schema.string(),
  message: _configSchema.schema.string(),
  payload: _configSchema.schema.maybe(_configSchema.schema.any()),
  agent_id: _configSchema.schema.string(),
  action_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  policy_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  stream_id: _configSchema.schema.maybe(_configSchema.schema.string())
};

const AckEventSchema = _configSchema.schema.object({ ...AgentEventBase,
  ...{
    action_id: _configSchema.schema.string()
  }
});

exports.AckEventSchema = AckEventSchema;

const NewAgentEventSchema = _configSchema.schema.object({ ...AgentEventBase
});

exports.NewAgentEventSchema = NewAgentEventSchema;

const AgentEventSchema = _configSchema.schema.object({ ...AgentEventBase,
  id: _configSchema.schema.string()
});

exports.AgentEventSchema = AgentEventSchema;

const NewAgentActionSchema = _configSchema.schema.oneOf([_configSchema.schema.object({
  type: _configSchema.schema.oneOf([_configSchema.schema.literal('POLICY_CHANGE'), _configSchema.schema.literal('UNENROLL'), _configSchema.schema.literal('UPGRADE'), _configSchema.schema.literal('INTERNAL_POLICY_REASSIGN')]),
  data: _configSchema.schema.maybe(_configSchema.schema.any()),
  ack_data: _configSchema.schema.maybe(_configSchema.schema.any())
}), _configSchema.schema.object({
  type: _configSchema.schema.oneOf([_configSchema.schema.literal('SETTINGS')]),
  data: _configSchema.schema.object({
    log_level: _configSchema.schema.oneOf([_configSchema.schema.literal('debug'), _configSchema.schema.literal('info'), _configSchema.schema.literal('warning'), _configSchema.schema.literal('error')])
  })
})]);

exports.NewAgentActionSchema = NewAgentActionSchema;