"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enroll = enroll;
exports.validateAgentVersion = validateAgentVersion;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _parse = _interopRequireDefault(require("semver/functions/parse"));

var _diff = _interopRequireDefault(require("semver/functions/diff"));

var _lte = _interopRequireDefault(require("semver/functions/lte"));

var _saved_objects = require("./saved_objects");

var _constants = require("../../constants");

var _errors = require("../../errors");

var APIKeyService = _interopRequireWildcard(require("../api_keys"));

var _services = require("../../services");

var _app_context = require("../app_context");

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


async function enroll(soClient, type, agentPolicyId, metadata) {
  var _metadata$local, _metadata$local$elast, _metadata$local$elast2, _appContextService$ge, _appContextService$ge2, _metadata$userProvide2, _metadata$local3;

  const agentVersion = metadata === null || metadata === void 0 ? void 0 : (_metadata$local = metadata.local) === null || _metadata$local === void 0 ? void 0 : (_metadata$local$elast = _metadata$local.elastic) === null || _metadata$local$elast === void 0 ? void 0 : (_metadata$local$elast2 = _metadata$local$elast.agent) === null || _metadata$local$elast2 === void 0 ? void 0 : _metadata$local$elast2.version;
  validateAgentVersion(agentVersion);
  const agentPolicy = await _services.agentPolicyService.get(soClient, agentPolicyId, false);

  if (agentPolicy !== null && agentPolicy !== void 0 && agentPolicy.is_managed) {
    throw new _errors.IngestManagerError(`Cannot enroll in managed policy ${agentPolicyId}`);
  }

  if ((_appContextService$ge = _app_context.appContextService.getConfig()) !== null && _appContextService$ge !== void 0 && (_appContextService$ge2 = _appContextService$ge.agents) !== null && _appContextService$ge2 !== void 0 && _appContextService$ge2.fleetServerEnabled) {
    var _metadata$userProvide, _metadata$local2;

    const esClient = _app_context.appContextService.getInternalUserESClient();

    const agentId = (0, _v.default)();
    const accessAPIKey = await APIKeyService.generateAccessApiKey(soClient, agentId);
    const fleetServerAgent = {
      active: true,
      policy_id: agentPolicyId,
      type,
      enrolled_at: new Date().toISOString(),
      user_provided_metadata: (_metadata$userProvide = metadata === null || metadata === void 0 ? void 0 : metadata.userProvided) !== null && _metadata$userProvide !== void 0 ? _metadata$userProvide : {},
      local_metadata: (_metadata$local2 = metadata === null || metadata === void 0 ? void 0 : metadata.local) !== null && _metadata$local2 !== void 0 ? _metadata$local2 : {},
      access_api_key_id: accessAPIKey.id
    };
    await esClient.create({
      index: _constants.AGENTS_INDEX,
      body: fleetServerAgent,
      id: agentId,
      refresh: 'wait_for'
    });
    return {
      id: agentId,
      current_error_events: [],
      packages: [],
      ...fleetServerAgent,
      access_api_key: accessAPIKey.key
    };
  }

  const agentData = {
    active: true,
    policy_id: agentPolicyId,
    type,
    enrolled_at: new Date().toISOString(),
    user_provided_metadata: (_metadata$userProvide2 = metadata === null || metadata === void 0 ? void 0 : metadata.userProvided) !== null && _metadata$userProvide2 !== void 0 ? _metadata$userProvide2 : {},
    local_metadata: (_metadata$local3 = metadata === null || metadata === void 0 ? void 0 : metadata.local) !== null && _metadata$local3 !== void 0 ? _metadata$local3 : {},
    current_error_events: undefined,
    access_api_key_id: undefined,
    last_checkin: undefined,
    default_api_key: undefined
  };
  const agent = (0, _saved_objects.savedObjectToAgent)(await soClient.create(_constants.AGENT_SAVED_OBJECT_TYPE, agentData, {
    refresh: false
  }));
  const accessAPIKey = await APIKeyService.generateAccessApiKey(soClient, agent.id);
  await soClient.update(_constants.AGENT_SAVED_OBJECT_TYPE, agent.id, {
    access_api_key_id: accessAPIKey.id
  });
  return { ...agent,
    access_api_key: accessAPIKey.key
  };
}

function validateAgentVersion(agentVersion, kibanaVersion = _app_context.appContextService.getKibanaVersion()) {
  const agentVersionParsed = (0, _parse.default)(agentVersion);

  if (!agentVersionParsed) {
    throw _boom.default.badRequest('Agent version not provided');
  }

  const kibanaVersionParsed = (0, _parse.default)(kibanaVersion);

  if (!kibanaVersionParsed) {
    throw _boom.default.badRequest('Kibana version is not set or provided');
  }

  const diff = (0, _diff.default)(agentVersion, kibanaVersion);

  switch (diff) {
    // section 1) very close versions, only patch release differences - all combos should work
    // Agent a.b.1 < Kibana a.b.2
    // Agent a.b.2 > Kibana a.b.1
    case null:
    case 'prerelease':
    case 'prepatch':
    case 'patch':
      return;
    // OK
    // section 2) somewhat close versions, Agent minor release is 1 or 2 versions back and is older than the stack:
    // Agent a.9.x < Kibana a.10.x
    // Agent a.9.x < Kibana a.11.x

    case 'preminor':
    case 'minor':
      if (agentVersionParsed.minor < kibanaVersionParsed.minor && kibanaVersionParsed.minor - agentVersionParsed.minor <= 2) return;
    // section 3) versions where Agent is a minor version or major version greater (newer) than the stack should not work:
    // Agent 7.10.x > Kibana 7.9.x
    // Agent 8.0.x > Kibana 7.9.x

    default:
      if ((0, _lte.default)(agentVersionParsed, kibanaVersionParsed)) return;else throw _boom.default.badRequest(`Agent version ${agentVersion} is not compatible with Kibana version ${kibanaVersion}`);
  }
}