"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postBulkAgentsUnenrollHandler = exports.postAgentUnenrollHandler = void 0;

var _services = require("../../services");

var AgentService = _interopRequireWildcard(require("../../services/agents"));

var _errors = require("../../errors");

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


const postAgentUnenrollHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;

  try {
    var _request$body;

    if (((_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.force) === true) {
      await AgentService.forceUnenrollAgent(soClient, esClient, request.params.agentId);
    } else {
      await AgentService.unenrollAgent(soClient, esClient, request.params.agentId);
    }

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

exports.postAgentUnenrollHandler = postAgentUnenrollHandler;

const postBulkAgentsUnenrollHandler = async (context, request, response) => {
  var _request$body2;

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
  const unenrollAgents = ((_request$body2 = request.body) === null || _request$body2 === void 0 ? void 0 : _request$body2.force) === true ? AgentService.forceUnenrollAgents : AgentService.unenrollAgents;

  try {
    if (Array.isArray(request.body.agents)) {
      await unenrollAgents(soClient, esClient, {
        agentIds: request.body.agents
      });
    } else {
      await unenrollAgents(soClient, esClient, {
        kuery: request.body.agents
      });
    }

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

exports.postBulkAgentsUnenrollHandler = postBulkAgentsUnenrollHandler;