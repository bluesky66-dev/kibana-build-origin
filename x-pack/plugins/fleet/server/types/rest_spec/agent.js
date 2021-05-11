"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetAgentStatusRequestSchema = exports.UpdateAgentRequestSchema = exports.DeleteAgentRequestSchema = exports.GetOneAgentEventsRequestSchema = exports.PostBulkAgentReassignRequestSchema = exports.PutAgentReassignRequestSchema = exports.PostBulkAgentUpgradeRequestSchema = exports.PostAgentUpgradeRequestSchema = exports.PostBulkAgentUnenrollRequestSchema = exports.PostAgentUnenrollRequestSchema = exports.PostNewAgentActionRequestSchema = exports.PostAgentAcksRequestBodyJSONSchema = exports.PostAgentAcksRequestParamsJSONSchema = exports.PostAgentEnrollRequestBodyJSONSchema = exports.PostAgentCheckinRequestBodyJSONSchema = exports.PostAgentCheckinRequestParamsJSONSchema = exports.GetOneAgentRequestSchema = exports.GetAgentsRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _models = require("../models");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const GetAgentsRequestSchema = {
  query: _configSchema.schema.object({
    page: _configSchema.schema.number({
      defaultValue: 1
    }),
    perPage: _configSchema.schema.number({
      defaultValue: 20
    }),
    kuery: _configSchema.schema.maybe(_configSchema.schema.string()),
    showInactive: _configSchema.schema.boolean({
      defaultValue: false
    }),
    showUpgradeable: _configSchema.schema.boolean({
      defaultValue: false
    })
  })
};
exports.GetAgentsRequestSchema = GetAgentsRequestSchema;
const GetOneAgentRequestSchema = {
  params: _configSchema.schema.object({
    agentId: _configSchema.schema.string()
  })
};
exports.GetOneAgentRequestSchema = GetOneAgentRequestSchema;
const PostAgentCheckinRequestParamsJSONSchema = {
  type: 'object',
  properties: {
    agentId: {
      type: 'string'
    }
  },
  required: ['agentId']
};
exports.PostAgentCheckinRequestParamsJSONSchema = PostAgentCheckinRequestParamsJSONSchema;
const PostAgentCheckinRequestBodyJSONSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['online', 'error', 'degraded']
    },
    local_metadata: {
      additionalProperties: {
        anyOf: [{
          type: 'string'
        }, {
          type: 'number'
        }, {
          type: 'object'
        }]
      }
    },
    events: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['STATE', 'ERROR', 'ACTION_RESULT', 'ACTION']
          },
          subtype: {
            type: 'string',
            enum: ['RUNNING', 'STARTING', 'IN_PROGRESS', 'CONFIG', 'FAILED', 'STOPPING', 'STOPPED', 'DEGRADED', 'DATA_DUMP', 'ACKNOWLEDGED', 'UPDATING', 'UNKNOWN']
          },
          timestamp: {
            type: 'string'
          },
          message: {
            type: 'string'
          },
          payload: {
            type: 'object',
            additionalProperties: true
          },
          agent_id: {
            type: 'string'
          },
          action_id: {
            type: 'string'
          },
          policy_id: {
            type: 'string'
          },
          stream_id: {
            type: 'string'
          }
        },
        required: ['type', 'subtype', 'timestamp', 'message', 'agent_id'],
        additionalProperties: false
      }
    }
  },
  additionalProperties: false
};
exports.PostAgentCheckinRequestBodyJSONSchema = PostAgentCheckinRequestBodyJSONSchema;
const PostAgentEnrollRequestBodyJSONSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['EPHEMERAL', 'PERMANENT', 'TEMPORARY']
    },
    // TODO deprecated should be removed in 8.0.0
    shared_id: {
      type: 'string'
    },
    metadata: {
      type: 'object',
      properties: {
        local: {
          type: 'object',
          additionalProperties: true
        },
        user_provided: {
          type: 'object',
          additionalProperties: true
        }
      },
      additionalProperties: false,
      required: ['local', 'user_provided']
    }
  },
  additionalProperties: false,
  required: ['type', 'metadata']
};
exports.PostAgentEnrollRequestBodyJSONSchema = PostAgentEnrollRequestBodyJSONSchema;
const PostAgentAcksRequestParamsJSONSchema = {
  type: 'object',
  properties: {
    agentId: {
      type: 'string'
    }
  },
  required: ['agentId']
};
exports.PostAgentAcksRequestParamsJSONSchema = PostAgentAcksRequestParamsJSONSchema;
const PostAgentAcksRequestBodyJSONSchema = {
  type: 'object',
  properties: {
    events: {
      type: 'array',
      item: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['STATE', 'ERROR', 'ACTION_RESULT', 'ACTION']
          },
          subtype: {
            type: 'string',
            enum: ['RUNNING', 'STARTING', 'IN_PROGRESS', 'CONFIG', 'FAILED', 'STOPPING', 'STOPPED', 'DEGRADED', 'DATA_DUMP', 'ACKNOWLEDGED', 'UNKNOWN']
          },
          timestamp: {
            type: 'string'
          },
          message: {
            type: 'string'
          },
          payload: {
            type: 'object',
            additionalProperties: true
          },
          agent_id: {
            type: 'string'
          },
          action_id: {
            type: 'string'
          },
          policy_id: {
            type: 'string'
          },
          stream_id: {
            type: 'string'
          }
        },
        required: ['type', 'subtype', 'timestamp', 'message', 'agent_id', 'action_id'],
        additionalProperties: false
      }
    }
  },
  additionalProperties: false,
  required: ['events']
};
exports.PostAgentAcksRequestBodyJSONSchema = PostAgentAcksRequestBodyJSONSchema;
const PostNewAgentActionRequestSchema = {
  body: _configSchema.schema.object({
    action: _models.NewAgentActionSchema
  }),
  params: _configSchema.schema.object({
    agentId: _configSchema.schema.string()
  })
};
exports.PostNewAgentActionRequestSchema = PostNewAgentActionRequestSchema;
const PostAgentUnenrollRequestSchema = {
  params: _configSchema.schema.object({
    agentId: _configSchema.schema.string()
  }),
  body: _configSchema.schema.nullable(_configSchema.schema.object({
    force: _configSchema.schema.boolean()
  }))
};
exports.PostAgentUnenrollRequestSchema = PostAgentUnenrollRequestSchema;
const PostBulkAgentUnenrollRequestSchema = {
  body: _configSchema.schema.object({
    agents: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.string()]),
    force: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.PostBulkAgentUnenrollRequestSchema = PostBulkAgentUnenrollRequestSchema;
const PostAgentUpgradeRequestSchema = {
  params: _configSchema.schema.object({
    agentId: _configSchema.schema.string()
  }),
  body: _configSchema.schema.object({
    source_uri: _configSchema.schema.maybe(_configSchema.schema.string()),
    version: _configSchema.schema.string(),
    force: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.PostAgentUpgradeRequestSchema = PostAgentUpgradeRequestSchema;
const PostBulkAgentUpgradeRequestSchema = {
  body: _configSchema.schema.object({
    agents: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.string()]),
    source_uri: _configSchema.schema.maybe(_configSchema.schema.string()),
    version: _configSchema.schema.string(),
    force: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.PostBulkAgentUpgradeRequestSchema = PostBulkAgentUpgradeRequestSchema;
const PutAgentReassignRequestSchema = {
  params: _configSchema.schema.object({
    agentId: _configSchema.schema.string()
  }),
  body: _configSchema.schema.object({
    policy_id: _configSchema.schema.string()
  })
};
exports.PutAgentReassignRequestSchema = PutAgentReassignRequestSchema;
const PostBulkAgentReassignRequestSchema = {
  body: _configSchema.schema.object({
    policy_id: _configSchema.schema.string(),
    agents: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.string()])
  })
};
exports.PostBulkAgentReassignRequestSchema = PostBulkAgentReassignRequestSchema;
const GetOneAgentEventsRequestSchema = {
  params: _configSchema.schema.object({
    agentId: _configSchema.schema.string()
  }),
  query: _configSchema.schema.object({
    page: _configSchema.schema.number({
      defaultValue: 1
    }),
    perPage: _configSchema.schema.number({
      defaultValue: 20
    }),
    kuery: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.GetOneAgentEventsRequestSchema = GetOneAgentEventsRequestSchema;
const DeleteAgentRequestSchema = {
  params: _configSchema.schema.object({
    agentId: _configSchema.schema.string()
  })
};
exports.DeleteAgentRequestSchema = DeleteAgentRequestSchema;
const UpdateAgentRequestSchema = {
  params: _configSchema.schema.object({
    agentId: _configSchema.schema.string()
  }),
  body: _configSchema.schema.object({
    user_provided_metadata: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())
  })
};
exports.UpdateAgentRequestSchema = UpdateAgentRequestSchema;
const GetAgentStatusRequestSchema = {
  query: _configSchema.schema.object({
    policyId: _configSchema.schema.maybe(_configSchema.schema.string()),
    kuery: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.GetAgentStatusRequestSchema = GetAgentStatusRequestSchema;