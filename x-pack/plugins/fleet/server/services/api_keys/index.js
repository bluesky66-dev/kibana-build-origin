"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  generateOutputApiKey: true,
  generateAccessApiKey: true,
  parseApiKeyFromHeaders: true,
  parseApiKey: true,
  invalidateAPIKeys: true
};
exports.generateOutputApiKey = generateOutputApiKey;
exports.generateAccessApiKey = generateAccessApiKey;
exports.parseApiKeyFromHeaders = parseApiKeyFromHeaders;
exports.parseApiKey = parseApiKey;
Object.defineProperty(exports, "invalidateAPIKeys", {
  enumerable: true,
  get: function () {
    return _security.invalidateAPIKeys;
  }
});

var _security = require("./security");

var _enrollment_api_key = require("./enrollment_api_key");

Object.keys(_enrollment_api_key).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _enrollment_api_key[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _enrollment_api_key[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function generateOutputApiKey(soClient, outputId, agentId) {
  const name = `${agentId}:${outputId}`;
  const key = await (0, _security.createAPIKey)(soClient, name, {
    'fleet-output': {
      cluster: ['monitor'],
      index: [{
        names: ['logs-*', 'metrics-*', 'traces-*', '.logs-endpoint.diagnostic.collection-*'],
        privileges: ['auto_configure', 'create_doc']
      }]
    }
  });

  if (!key) {
    throw new Error('Unable to create an output api key');
  }

  return {
    key: `${key.id}:${key.api_key}`,
    id: key.id
  };
}

async function generateAccessApiKey(soClient, agentId) {
  const key = await (0, _security.createAPIKey)(soClient, agentId, {
    // Useless role to avoid to have the privilege of the user that created the key
    'fleet-apikey-access': {
      cluster: [],
      applications: [{
        application: '.fleet',
        privileges: ['no-privileges'],
        resources: ['*']
      }]
    }
  });

  if (!key) {
    throw new Error('Unable to create an access api key');
  }

  return {
    id: key.id,
    key: Buffer.from(`${key.id}:${key.api_key}`).toString('base64')
  };
}

function parseApiKeyFromHeaders(headers) {
  const authorizationHeader = headers.authorization;

  if (!authorizationHeader) {
    throw new Error('Authorization header must be set');
  }

  if (Array.isArray(authorizationHeader)) {
    throw new Error('Authorization header must be `string` not `string[]`');
  }

  if (!authorizationHeader.startsWith('ApiKey ')) {
    throw new Error('Authorization header is malformed');
  }

  const apiKey = authorizationHeader.split(' ')[1];
  return parseApiKey(apiKey);
}

function parseApiKey(apiKey) {
  const apiKeyId = Buffer.from(apiKey, 'base64').toString('utf8').split(':')[0];
  return {
    apiKey,
    apiKeyId
  };
}