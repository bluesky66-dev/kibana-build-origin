"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkVersionIsSame = exports.postBulkAgentsUpgradeHandler = exports.postAgentUpgradeHandler = void 0;

var _coerce = _interopRequireDefault(require("semver/functions/coerce"));

var AgentService = _interopRequireWildcard(require("../../services/agents"));

var _services = require("../../services");

var _errors = require("../../errors");

var _services2 = require("../../../common/services");

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


const postAgentUpgradeHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;
  const {
    version,
    source_uri: sourceUri,
    force
  } = request.body;

  const kibanaVersion = _services.appContextService.getKibanaVersion();

  try {
    checkVersionIsSame(version, kibanaVersion);
  } catch (err) {
    return response.customError({
      statusCode: 400,
      body: {
        message: err.message
      }
    });
  }

  const agent = await (0, AgentService.getAgent)(soClient, esClient, request.params.agentId);

  if (agent.unenrollment_started_at || agent.unenrolled_at) {
    return response.customError({
      statusCode: 400,
      body: {
        message: 'cannot upgrade an unenrolling or unenrolled agent'
      }
    });
  }

  if (!force && !(0, _services2.isAgentUpgradeable)(agent, kibanaVersion)) {
    return response.customError({
      statusCode: 400,
      body: {
        message: `agent ${request.params.agentId} is not upgradeable`
      }
    });
  }

  try {
    await AgentService.sendUpgradeAgentAction({
      soClient,
      esClient,
      agentId: request.params.agentId,
      version,
      sourceUri
    });
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

exports.postAgentUpgradeHandler = postAgentUpgradeHandler;

const postBulkAgentsUpgradeHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;
  const {
    version,
    source_uri: sourceUri,
    agents,
    force
  } = request.body;

  const kibanaVersion = _services.appContextService.getKibanaVersion();

  try {
    checkVersionIsSame(version, kibanaVersion);
  } catch (err) {
    return response.customError({
      statusCode: 400,
      body: {
        message: err.message
      }
    });
  }

  try {
    if (Array.isArray(agents)) {
      await AgentService.sendUpgradeAgentsActions(soClient, esClient, {
        agentIds: agents,
        sourceUri,
        version,
        force
      });
    } else {
      await AgentService.sendUpgradeAgentsActions(soClient, esClient, {
        kuery: agents,
        sourceUri,
        version,
        force
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

exports.postBulkAgentsUpgradeHandler = postBulkAgentsUpgradeHandler;

const checkVersionIsSame = (version, kibanaVersion) => {
  var _semverCoerce, _semverCoerce2; // get version number only in case "-SNAPSHOT" is in it


  const kibanaVersionNumber = (_semverCoerce = (0, _coerce.default)(kibanaVersion)) === null || _semverCoerce === void 0 ? void 0 : _semverCoerce.version;
  if (!kibanaVersionNumber) throw new Error(`kibanaVersion ${kibanaVersionNumber} is not valid`);
  const versionToUpgradeNumber = (_semverCoerce2 = (0, _coerce.default)(version)) === null || _semverCoerce2 === void 0 ? void 0 : _semverCoerce2.version;
  if (!versionToUpgradeNumber) throw new Error(`version to upgrade ${versionToUpgradeNumber} is not valid`); // temporarily only allow upgrading to the same version as the installed kibana version

  if (kibanaVersionNumber !== versionToUpgradeNumber) throw new Error(`cannot upgrade agent to ${versionToUpgradeNumber} because it is different than the installed kibana version ${kibanaVersionNumber}`);
};

exports.checkVersionIsSame = checkVersionIsSame;