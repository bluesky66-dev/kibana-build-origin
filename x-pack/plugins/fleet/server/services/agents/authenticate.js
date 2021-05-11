"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticateAgentWithAccessToken = authenticateAgentWithAccessToken;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var APIKeyService = _interopRequireWildcard(require("../api_keys"));

var _crud = require("./crud");

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


async function authenticateAgentWithAccessToken(soClient, esClient, request) {
  if (!request.auth.isAuthenticated) {
    throw _boom.default.unauthorized('Request not authenticated');
  }

  let res;

  try {
    res = APIKeyService.parseApiKeyFromHeaders(request.headers);
  } catch (err) {
    throw _boom.default.unauthorized(err.message);
  }

  const agent = await (0, _crud.getAgentByAccessAPIKeyId)(soClient, esClient, res.apiKeyId);
  return agent;
}