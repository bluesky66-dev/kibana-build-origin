"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerElasticAgentRoutes = exports.registerAPIRoutes = void 0;

var _ajv = _interopRequireDefault(require("ajv"));

var _constants = require("../../constants");

var _types = require("../../types");

var _handlers = require("./handlers");

var _acks_handlers = require("./acks_handlers");

var AgentService = _interopRequireWildcard(require("../../services/agents"));

var _actions_handlers = require("./actions_handlers");

var _services = require("../../services");

var _unenroll_handler = require("./unenroll_handler");

var _upgrade_handler = require("./upgrade_handler");

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


const ajv = new _ajv.default({
  coerceTypes: true,
  useDefaults: true,
  removeAdditional: true,
  allErrors: false,
  nullable: true
});

function schemaErrorsText(errors, dataVar) {
  return errors.map(e => `${dataVar + (e.dataPath || '')} ${e.message}`).join(', ');
}

function makeValidator(jsonSchema) {
  const validator = ajv.compile(jsonSchema);
  return function validateWithAJV(data, r) {
    if (validator(data)) {
      return r.ok(data);
    }

    return r.badRequest(schemaErrorsText(validator.errors || [], data));
  };
}

const registerAPIRoutes = (router, config) => {
  // Get one
  router.get({
    path: _constants.AGENT_API_ROUTES.INFO_PATTERN,
    validate: _types.GetOneAgentRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getAgentHandler); // Update

  router.put({
    path: _constants.AGENT_API_ROUTES.UPDATE_PATTERN,
    validate: _types.UpdateAgentRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.updateAgentHandler); // Delete

  router.delete({
    path: _constants.AGENT_API_ROUTES.DELETE_PATTERN,
    validate: _types.DeleteAgentRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.deleteAgentHandler); // List

  router.get({
    path: _constants.AGENT_API_ROUTES.LIST_PATTERN,
    validate: _types.GetAgentsRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getAgentsHandler); // Agent actions

  router.post({
    path: _constants.AGENT_API_ROUTES.ACTIONS_PATTERN,
    validate: _types.PostNewAgentActionRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, (0, _actions_handlers.postNewAgentActionHandlerBuilder)({
    getAgent: AgentService.getAgent,
    createAgentAction: AgentService.createAgentAction
  }));
  router.post({
    path: _constants.AGENT_API_ROUTES.UNENROLL_PATTERN,
    validate: _types.PostAgentUnenrollRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _unenroll_handler.postAgentUnenrollHandler);
  router.put({
    path: _constants.AGENT_API_ROUTES.REASSIGN_PATTERN,
    validate: _types.PutAgentReassignRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.putAgentsReassignHandler); // Get agent events

  router.get({
    path: _constants.AGENT_API_ROUTES.EVENTS_PATTERN,
    validate: _types.GetOneAgentEventsRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getAgentEventsHandler); // Get agent status for policy

  router.get({
    path: _constants.AGENT_API_ROUTES.STATUS_PATTERN,
    validate: _types.GetAgentStatusRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getAgentStatusForAgentPolicyHandler); // upgrade agent

  router.post({
    path: _constants.AGENT_API_ROUTES.UPGRADE_PATTERN,
    validate: _types.PostAgentUpgradeRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _upgrade_handler.postAgentUpgradeHandler); // bulk upgrade

  router.post({
    path: _constants.AGENT_API_ROUTES.BULK_UPGRADE_PATTERN,
    validate: _types.PostBulkAgentUpgradeRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _upgrade_handler.postBulkAgentsUpgradeHandler); // Bulk reassign

  router.post({
    path: _constants.AGENT_API_ROUTES.BULK_REASSIGN_PATTERN,
    validate: _types.PostBulkAgentReassignRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.postBulkAgentsReassignHandler); // Bulk unenroll

  router.post({
    path: _constants.AGENT_API_ROUTES.BULK_UNENROLL_PATTERN,
    validate: _types.PostBulkAgentUnenrollRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _unenroll_handler.postBulkAgentsUnenrollHandler);
};

exports.registerAPIRoutes = registerAPIRoutes;

const registerElasticAgentRoutes = (router, config) => {
  const pollingRequestTimeout = config.agents.pollingRequestTimeout; // Agent checkin

  router.post({
    path: _constants.AGENT_API_ROUTES.CHECKIN_PATTERN,
    validate: {
      params: makeValidator(_types.PostAgentCheckinRequestParamsJSONSchema),
      body: makeValidator(_types.PostAgentCheckinRequestBodyJSONSchema)
    },
    options: {
      tags: [],
      // If the timeout is too short, do not set socket idle timeout and rely on Kibana global socket timeout
      ...(pollingRequestTimeout && pollingRequestTimeout > _constants.AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS ? {
        timeout: {
          idleSocket: pollingRequestTimeout
        }
      } : {})
    }
  }, _handlers.postAgentCheckinHandler); // BWC for agent <= 7.9

  router.post({
    path: _constants.AGENT_API_ROUTES_7_9.CHECKIN_PATTERN,
    validate: {
      params: makeValidator(_types.PostAgentCheckinRequestParamsJSONSchema),
      body: makeValidator(_types.PostAgentCheckinRequestBodyJSONSchema)
    },
    options: {
      tags: [],
      // If the timeout is too short, do not set socket idle timeout and rely on Kibana global socket timeout
      ...(pollingRequestTimeout && pollingRequestTimeout > _constants.AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS ? {
        timeout: {
          idleSocket: pollingRequestTimeout
        }
      } : {})
    }
  }, _handlers.postAgentCheckinHandler); // Agent enrollment

  router.post({
    path: _constants.AGENT_API_ROUTES.ENROLL_PATTERN,
    validate: {
      body: makeValidator(_types.PostAgentEnrollRequestBodyJSONSchema)
    },
    options: {
      tags: [_constants.LIMITED_CONCURRENCY_ROUTE_TAG]
    }
  }, _handlers.postAgentEnrollHandler); // BWC for agent <= 7.9

  router.post({
    path: _constants.AGENT_API_ROUTES_7_9.ENROLL_PATTERN,
    validate: {
      body: makeValidator(_types.PostAgentEnrollRequestBodyJSONSchema)
    },
    options: {
      tags: [_constants.LIMITED_CONCURRENCY_ROUTE_TAG]
    }
  }, _handlers.postAgentEnrollHandler); // Agent acks

  router.post({
    path: _constants.AGENT_API_ROUTES.ACKS_PATTERN,
    validate: {
      params: makeValidator(_types.PostAgentAcksRequestParamsJSONSchema),
      body: makeValidator(_types.PostAgentAcksRequestBodyJSONSchema)
    },
    options: {
      tags: [_constants.LIMITED_CONCURRENCY_ROUTE_TAG]
    }
  }, (0, _acks_handlers.postAgentAcksHandlerBuilder)({
    acknowledgeAgentActions: AgentService.acknowledgeAgentActions,
    authenticateAgentWithAccessToken: AgentService.authenticateAgentWithAccessToken,
    getSavedObjectsClientContract: _services.appContextService.getInternalUserSOClient.bind(_services.appContextService),
    getElasticsearchClientContract: _services.appContextService.getInternalUserESClient.bind(_services.appContextService),
    saveAgentEvents: AgentService.saveAgentEvents
  })); // BWC for agent <= 7.9

  router.post({
    path: _constants.AGENT_API_ROUTES_7_9.ACKS_PATTERN,
    validate: {
      params: makeValidator(_types.PostAgentAcksRequestParamsJSONSchema),
      body: makeValidator(_types.PostAgentAcksRequestBodyJSONSchema)
    },
    options: {
      tags: [_constants.LIMITED_CONCURRENCY_ROUTE_TAG]
    }
  }, (0, _acks_handlers.postAgentAcksHandlerBuilder)({
    acknowledgeAgentActions: AgentService.acknowledgeAgentActions,
    authenticateAgentWithAccessToken: AgentService.authenticateAgentWithAccessToken,
    getSavedObjectsClientContract: _services.appContextService.getInternalUserSOClient.bind(_services.appContextService),
    getElasticsearchClientContract: _services.appContextService.getInternalUserESClient.bind(_services.appContextService),
    saveAgentEvents: AgentService.saveAgentEvents
  }));
};

exports.registerElasticAgentRoutes = registerElasticAgentRoutes;