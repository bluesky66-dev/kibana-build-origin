"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentStatusForAgentPolicyHandler = exports.postBulkAgentsReassignHandler = exports.putAgentsReassignHandler = exports.getAgentsHandler = exports.postAgentEnrollHandler = exports.postAgentCheckinHandler = exports.updateAgentHandler = exports.deleteAgentHandler = exports.getAgentEventsHandler = exports.getAgentHandler = void 0;

var _abortController = require("abort-controller");

var _errors = require("../../errors");

var _services = require("../../services");

var AgentService = _interopRequireWildcard(require("../../services/agents"));

var APIKeyService = _interopRequireWildcard(require("../../services/api_keys"));

var _app_context = require("../../services/app_context");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAgentHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    const agent = await AgentService.getAgent(soClient, esClient, request.params.agentId);
    const body = {
      item: { ...agent,
        status: AgentService.getAgentStatus(agent)
      }
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (soClient.errors.isNotFoundError(error)) {
      return response.notFound({
        body: {
          message: `Agent ${request.params.agentId} not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getAgentHandler = getAgentHandler;

const getAgentEventsHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;

  try {
    const {
      page,
      perPage,
      kuery
    } = request.query;
    const {
      items,
      total
    } = await AgentService.getAgentEvents(soClient, request.params.agentId, {
      page,
      perPage,
      kuery
    });
    const body = {
      list: items,
      total,
      page,
      perPage
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `Agent ${request.params.agentId} not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getAgentEventsHandler = getAgentEventsHandler;

const deleteAgentHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    await AgentService.deleteAgent(soClient, esClient, request.params.agentId);
    const body = {
      action: 'deleted'
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom) {
      return response.customError({
        statusCode: error.output.statusCode,
        body: {
          message: `Agent ${request.params.agentId} not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.deleteAgentHandler = deleteAgentHandler;

const updateAgentHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    await AgentService.updateAgent(soClient, esClient, request.params.agentId, {
      user_provided_metadata: request.body.user_provided_metadata
    });
    const agent = await AgentService.getAgent(soClient, esClient, request.params.agentId);
    const body = {
      item: { ...agent,
        status: AgentService.getAgentStatus(agent)
      }
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `Agent ${request.params.agentId} not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.updateAgentHandler = updateAgentHandler;

const postAgentCheckinHandler = async (context, request, response) => {
  try {
    const soClient = _app_context.appContextService.getInternalUserSOClient(request);

    const esClient = _app_context.appContextService.getInternalUserESClient();

    const agent = await AgentService.authenticateAgentWithAccessToken(soClient, esClient, request);
    const abortController = new _abortController.AbortController();
    request.events.aborted$.subscribe(() => {
      abortController.abort();
    });
    const signal = abortController.signal;
    const {
      actions
    } = await AgentService.agentCheckin(soClient, esClient, agent, {
      events: request.body.events || [],
      localMetadata: request.body.local_metadata,
      status: request.body.status
    }, {
      signal
    });
    const body = {
      action: 'checkin',
      actions: actions.map(a => ({
        agent_id: agent.id,
        type: a.type,
        data: a.data,
        id: a.id,
        created_at: a.created_at
      }))
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.postAgentCheckinHandler = postAgentCheckinHandler;

const postAgentEnrollHandler = async (context, request, response) => {
  try {
    const soClient = _app_context.appContextService.getInternalUserSOClient(request);

    const esClient = context.core.elasticsearch.client.asInternalUser;
    const {
      apiKeyId
    } = APIKeyService.parseApiKeyFromHeaders(request.headers);
    const enrollmentAPIKey = await APIKeyService.getEnrollmentAPIKeyById(soClient, esClient, apiKeyId);

    if (!enrollmentAPIKey || !enrollmentAPIKey.active) {
      return response.unauthorized({
        body: {
          message: 'Invalid Enrollment API Key'
        }
      });
    }

    const agent = await AgentService.enroll(soClient, request.body.type, enrollmentAPIKey.policy_id, {
      userProvided: request.body.metadata.user_provided,
      local: request.body.metadata.local
    });
    const body = {
      action: 'created',
      item: { ...agent,
        status: AgentService.getAgentStatus(agent)
      }
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.postAgentEnrollHandler = postAgentEnrollHandler;

const getAgentsHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    const {
      agents,
      total,
      page,
      perPage
    } = await AgentService.listAgents(soClient, esClient, {
      page: request.query.page,
      perPage: request.query.perPage,
      showInactive: request.query.showInactive,
      showUpgradeable: request.query.showUpgradeable,
      kuery: request.query.kuery
    });
    const totalInactive = request.query.showInactive ? await AgentService.countInactiveAgents(soClient, esClient, {
      kuery: request.query.kuery
    }) : 0;
    const body = {
      list: agents.map(agent => ({ ...agent,
        status: AgentService.getAgentStatus(agent)
      })),
      total,
      totalInactive,
      page,
      perPage
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getAgentsHandler = getAgentsHandler;

const putAgentsReassignHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;

  try {
    await AgentService.reassignAgent(soClient, esClient, request.params.agentId, request.body.policy_id);
    const body = {};
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.putAgentsReassignHandler = putAgentsReassignHandler;

const postBulkAgentsReassignHandler = async (context, request, response) => {
  if (!_services.licenseService.isGoldPlus()) {
    return response.customError({
      statusCode: 403,
      body: {
        message: 'Requires Gold license'
      }
    });
  }

  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;

  try {
    const results = await AgentService.reassignAgents(soClient, esClient, Array.isArray(request.body.agents) ? {
      agentIds: request.body.agents
    } : {
      kuery: request.body.agents
    }, request.body.policy_id);
    const body = results.items.reduce((acc, so) => {
      return { ...acc,
        [so.id]: {
          success: !so.error,
          error: so.error || undefined
        }
      };
    }, {});
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.postBulkAgentsReassignHandler = postBulkAgentsReassignHandler;

const getAgentStatusForAgentPolicyHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    // TODO change path
    const results = await AgentService.getAgentStatusForAgentPolicy(soClient, esClient, request.query.policyId, request.query.kuery);
    const body = {
      results
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getAgentStatusForAgentPolicyHandler = getAgentStatusForAgentPolicyHandler;