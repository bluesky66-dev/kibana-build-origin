"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listEnrollmentApiKeys = listEnrollmentApiKeys;
exports.getEnrollmentAPIKey = getEnrollmentAPIKey;
exports.deleteEnrollmentApiKey = deleteEnrollmentApiKey;
exports.deleteEnrollmentApiKeyForAgentPolicyId = deleteEnrollmentApiKeyForAgentPolicyId;
exports.generateEnrollmentAPIKey = generateEnrollmentAPIKey;
exports.getEnrollmentAPIKeyById = getEnrollmentAPIKeyById;

var _app_context = require("../app_context");

var enrollmentApiKeyServiceSO = _interopRequireWildcard(require("./enrollment_api_key_so"));

var enrollmentApiKeyServiceFleetServer = _interopRequireWildcard(require("./enrollment_api_key_fleet_server"));

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


async function listEnrollmentApiKeys(soClient, esClient, options) {
  var _appContextService$ge, _appContextService$ge2;

  if (((_appContextService$ge = _app_context.appContextService.getConfig()) === null || _appContextService$ge === void 0 ? void 0 : (_appContextService$ge2 = _appContextService$ge.agents) === null || _appContextService$ge2 === void 0 ? void 0 : _appContextService$ge2.fleetServerEnabled) === true) {
    return enrollmentApiKeyServiceFleetServer.listEnrollmentApiKeys(esClient, options);
  } else {
    return enrollmentApiKeyServiceSO.listEnrollmentApiKeys(soClient, options);
  }
}

async function getEnrollmentAPIKey(soClient, esClient, id) {
  var _appContextService$ge3, _appContextService$ge4;

  if (((_appContextService$ge3 = _app_context.appContextService.getConfig()) === null || _appContextService$ge3 === void 0 ? void 0 : (_appContextService$ge4 = _appContextService$ge3.agents) === null || _appContextService$ge4 === void 0 ? void 0 : _appContextService$ge4.fleetServerEnabled) === true) {
    return enrollmentApiKeyServiceFleetServer.getEnrollmentAPIKey(esClient, id);
  } else {
    return enrollmentApiKeyServiceSO.getEnrollmentAPIKey(soClient, id);
  }
}
/**
 * Invalidate an api key and mark it as inactive
 * @param soClient
 * @param id
 */


async function deleteEnrollmentApiKey(soClient, esClient, id) {
  var _appContextService$ge5, _appContextService$ge6;

  if (((_appContextService$ge5 = _app_context.appContextService.getConfig()) === null || _appContextService$ge5 === void 0 ? void 0 : (_appContextService$ge6 = _appContextService$ge5.agents) === null || _appContextService$ge6 === void 0 ? void 0 : _appContextService$ge6.fleetServerEnabled) === true) {
    return enrollmentApiKeyServiceFleetServer.deleteEnrollmentApiKey(soClient, esClient, id);
  } else {
    return enrollmentApiKeyServiceSO.deleteEnrollmentApiKey(soClient, id);
  }
}

async function deleteEnrollmentApiKeyForAgentPolicyId(soClient, agentPolicyId) {
  return enrollmentApiKeyServiceSO.deleteEnrollmentApiKeyForAgentPolicyId(soClient, agentPolicyId);
}

async function generateEnrollmentAPIKey(soClient, esClient, data) {
  var _appContextService$ge7, _appContextService$ge8;

  if (((_appContextService$ge7 = _app_context.appContextService.getConfig()) === null || _appContextService$ge7 === void 0 ? void 0 : (_appContextService$ge8 = _appContextService$ge7.agents) === null || _appContextService$ge8 === void 0 ? void 0 : _appContextService$ge8.fleetServerEnabled) === true) {
    return enrollmentApiKeyServiceFleetServer.generateEnrollmentAPIKey(soClient, esClient, data);
  } else {
    return enrollmentApiKeyServiceSO.generateEnrollmentAPIKey(soClient, data);
  }
}

async function getEnrollmentAPIKeyById(soClient, esClient, apiKeyId) {
  var _appContextService$ge9, _appContextService$ge10;

  if (((_appContextService$ge9 = _app_context.appContextService.getConfig()) === null || _appContextService$ge9 === void 0 ? void 0 : (_appContextService$ge10 = _appContextService$ge9.agents) === null || _appContextService$ge10 === void 0 ? void 0 : _appContextService$ge10.fleetServerEnabled) === true) {
    return enrollmentApiKeyServiceFleetServer.getEnrollmentAPIKeyById(esClient, apiKeyId);
  } else {
    return enrollmentApiKeyServiceSO.getEnrollmentAPIKeyById(soClient, apiKeyId);
  }
}