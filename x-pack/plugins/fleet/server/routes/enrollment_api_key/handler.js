"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOneEnrollmentApiKeyHandler = exports.deleteEnrollmentApiKeyHandler = exports.postEnrollmentApiKeyHandler = exports.getEnrollmentApiKeysHandler = void 0;

var APIKeyService = _interopRequireWildcard(require("../../services/api_keys"));

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


const getEnrollmentApiKeysHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    const {
      items,
      total,
      page,
      perPage
    } = await APIKeyService.listEnrollmentApiKeys(soClient, esClient, {
      page: request.query.page,
      perPage: request.query.perPage,
      kuery: request.query.kuery
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
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getEnrollmentApiKeysHandler = getEnrollmentApiKeysHandler;

const postEnrollmentApiKeyHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    const apiKey = await APIKeyService.generateEnrollmentAPIKey(soClient, esClient, {
      name: request.body.name,
      expiration: request.body.expiration,
      agentPolicyId: request.body.policy_id
    });
    const body = {
      item: apiKey,
      action: 'created'
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

exports.postEnrollmentApiKeyHandler = postEnrollmentApiKeyHandler;

const deleteEnrollmentApiKeyHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    await APIKeyService.deleteEnrollmentApiKey(soClient, esClient, request.params.keyId);
    const body = {
      action: 'deleted'
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `EnrollmentAPIKey ${request.params.keyId} not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.deleteEnrollmentApiKeyHandler = deleteEnrollmentApiKeyHandler;

const getOneEnrollmentApiKeyHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    const apiKey = await APIKeyService.getEnrollmentAPIKey(soClient, esClient, request.params.keyId);
    const body = {
      item: apiKey
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `EnrollmentAPIKey ${request.params.keyId} not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getOneEnrollmentApiKeyHandler = getOneEnrollmentApiKeyHandler;