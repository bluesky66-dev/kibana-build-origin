"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNewActionsSharedObservable = createNewActionsSharedObservable;
exports.createAgentActionFromPolicyAction = createAgentActionFromPolicyAction;
exports.agentCheckinStateNewActionsFactory = agentCheckinStateNewActionsFactory;

var _parse = _interopRequireDefault(require("semver/functions/parse"));

var _lt = _interopRequireDefault(require("semver/functions/lt"));

var _rxjs = require("rxjs");

var _lodash = require("lodash");

var _operators = require("rxjs/operators");

var APIKeysService = _interopRequireWildcard(require("../../api_keys"));

var _constants = require("../../../constants");

var _actions = require("../actions");

var _app_context = require("../../app_context");

var _rxjs_utils = require("./rxjs_utils");

var _crud = require("../crud");

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


function getInternalUserSOClient() {
  const fakeRequest = {
    headers: {},
    getBasePath: () => '',
    path: '/',
    route: {
      settings: {}
    },
    url: {
      href: '/'
    },
    raw: {
      req: {
        url: '/'
      }
    }
  };
  return _app_context.appContextService.getInternalUserSOClient(fakeRequest);
}

function createNewActionsSharedObservable() {
  let lastTimestamp = new Date().toISOString();
  return (0, _rxjs.timer)(0, _constants.AGENT_UPDATE_ACTIONS_INTERVAL_MS).pipe((0, _operators.exhaustMap)(() => {
    const internalSOClient = getInternalUserSOClient();
    return (0, _rxjs.from)((0, _actions.getNewActionsSince)(internalSOClient, lastTimestamp).then(data => {
      if (data.length > 0) {
        lastTimestamp = data.reduce((acc, action) => {
          return acc >= action.created_at ? acc : action.created_at;
        }, lastTimestamp);
      }

      return data;
    }));
  }), (0, _operators.filter)(data => {
    return data.length > 0;
  }), (0, _operators.share)());
}

function createAgentPolicyActionSharedObservable(agentPolicyId) {
  const internalSOClient = getInternalUserSOClient();
  return (0, _rxjs.timer)(0, _constants.AGENT_UPDATE_ACTIONS_INTERVAL_MS).pipe((0, _operators.switchMap)(() => (0, _rxjs.from)((0, _actions.getLatestConfigChangeAction)(internalSOClient, agentPolicyId))), (0, _operators.filter)(data => data !== undefined), (0, _operators.distinctUntilKeyChanged)('id'), (0, _operators.switchMap)(data => (0, _rxjs.from)((0, _actions.getAgentPolicyActionByIds)(internalSOClient, [data.id]).then(r => r[0]))), (0, _operators.shareReplay)({
    refCount: true,
    bufferSize: 1
  }));
}

async function getAgentDefaultOutputAPIKey(soClient, esClient, agent) {
  var _appContextService$ge, _appContextService$ge2;

  if ((_appContextService$ge = _app_context.appContextService.getConfig()) !== null && _appContextService$ge !== void 0 && (_appContextService$ge2 = _appContextService$ge.agents) !== null && _appContextService$ge2 !== void 0 && _appContextService$ge2.fleetServerEnabled) {
    return agent.default_api_key;
  } else {
    const {
      attributes: {
        default_api_key: defaultApiKey
      }
    } = await _app_context.appContextService.getEncryptedSavedObjects().getDecryptedAsInternalUser(_constants.AGENT_SAVED_OBJECT_TYPE, agent.id);
    return defaultApiKey;
  }
}

async function getOrCreateAgentDefaultOutputAPIKey(soClient, esClient, agent) {
  const defaultAPIKey = await getAgentDefaultOutputAPIKey(soClient, esClient, agent);

  if (defaultAPIKey) {
    return defaultAPIKey;
  }

  const outputAPIKey = await APIKeysService.generateOutputApiKey(soClient, 'default', agent.id);
  await (0, _crud.updateAgent)(soClient, esClient, agent.id, {
    default_api_key: outputAPIKey.key,
    default_api_key_id: outputAPIKey.id
  });
  return outputAPIKey.key;
}

async function createAgentActionFromPolicyAction(soClient, esClient, agent, policyAction) {
  var _agent$local_metadata, _agent$local_metadata2, _agent$local_metadata3; // Transform the policy action for agent version <=  7.9.x for BWC


  const agentVersion = (0, _parse.default)((_agent$local_metadata = agent.local_metadata) === null || _agent$local_metadata === void 0 ? void 0 : (_agent$local_metadata2 = _agent$local_metadata.elastic) === null || _agent$local_metadata2 === void 0 ? void 0 : (_agent$local_metadata3 = _agent$local_metadata2.agent) === null || _agent$local_metadata3 === void 0 ? void 0 : _agent$local_metadata3.version);
  const agentPolicyAction = agentVersion && (0, _lt.default)(agentVersion, // A prerelease tag is added here so that agent versions with prerelease tags can be compared
  // correctly using `semvar`
  '7.10.0-SNAPSHOT', {
    includePrerelease: true
  }) ? { ...policyAction,
    type: 'CONFIG_CHANGE',
    data: {
      config: policyAction.data.policy
    }
  } : policyAction; // Create agent action

  const newAgentAction = Object.assign((0, _lodash.omit)( // Faster than clone
  JSON.parse(JSON.stringify(agentPolicyAction)), 'policy_id', 'policy_revision'), {
    agent_id: agent.id
  }); // Mutate the policy to set the api token for this agent

  const apiKey = await getOrCreateAgentDefaultOutputAPIKey(soClient, esClient, agent);

  if (newAgentAction.data.policy) {
    newAgentAction.data.policy.outputs.default.api_key = apiKey;
  } // BWC for agent <= 7.9
  else if (newAgentAction.data.config) {
      newAgentAction.data.config.outputs.default.api_key = apiKey;
    }

  return [newAgentAction];
}

function getPollingTimeoutMs() {
  var _appContextService$ge3, _appContextService$ge4;

  const pollingTimeoutMs = (_appContextService$ge3 = (_appContextService$ge4 = _app_context.appContextService.getConfig()) === null || _appContextService$ge4 === void 0 ? void 0 : _appContextService$ge4.agents.pollingRequestTimeout) !== null && _appContextService$ge3 !== void 0 ? _appContextService$ge3 : 0; // If polling timeout is too short do not use margin

  if (pollingTimeoutMs <= _constants.AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS) {
    return pollingTimeoutMs;
  } // Set a timeout 20s before the real timeout to have a chance to respond an empty response before socket timeout


  return Math.max(pollingTimeoutMs - _constants.AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS, _constants.AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS);
}

function agentCheckinStateNewActionsFactory() {
  var _appContextService$ge5, _appContextService$ge6, _appContextService$ge7, _appContextService$ge8; // Shared Observables


  const agentPolicies$ = new Map();
  const newActions$ = createNewActionsSharedObservable(); // Rx operators

  const pollingTimeoutMs = getPollingTimeoutMs();
  const rateLimiterIntervalMs = (_appContextService$ge5 = (_appContextService$ge6 = _app_context.appContextService.getConfig()) === null || _appContextService$ge6 === void 0 ? void 0 : _appContextService$ge6.agents.agentPolicyRolloutRateLimitIntervalMs) !== null && _appContextService$ge5 !== void 0 ? _appContextService$ge5 : _constants.AGENT_POLICY_ROLLOUT_RATE_LIMIT_INTERVAL_MS;
  const rateLimiterRequestPerInterval = (_appContextService$ge7 = (_appContextService$ge8 = _app_context.appContextService.getConfig()) === null || _appContextService$ge8 === void 0 ? void 0 : _appContextService$ge8.agents.agentPolicyRolloutRateLimitRequestPerInterval) !== null && _appContextService$ge7 !== void 0 ? _appContextService$ge7 : _constants.AGENT_POLICY_ROLLOUT_RATE_LIMIT_REQUEST_PER_INTERVAL;
  const rateLimiterMaxDelay = pollingTimeoutMs;
  const rateLimiter = (0, _rxjs_utils.createRateLimiter)(rateLimiterIntervalMs, rateLimiterRequestPerInterval, rateLimiterMaxDelay);

  function getOrCreateAgentPolicyObservable(agentPolicyId) {
    if (!agentPolicies$.has(agentPolicyId)) {
      agentPolicies$.set(agentPolicyId, createAgentPolicyActionSharedObservable(agentPolicyId));
    }

    const agentPolicy$ = agentPolicies$.get(agentPolicyId);

    if (!agentPolicy$) {
      throw new Error(`Invalid state, no observable for policy ${agentPolicyId}`);
    }

    return agentPolicy$;
  }

  async function subscribeToNewActions(soClient, esClient, agent, options) {
    if (!agent.policy_id) {
      throw new Error('Agent does not have a policy');
    }

    const agentPolicy$ = getOrCreateAgentPolicyObservable(agent.policy_id);
    const stream$ = agentPolicy$.pipe((0, _operators.timeout)(pollingTimeoutMs), (0, _operators.filter)(action => agent.policy_id !== undefined && action.policy_revision !== undefined && action.policy_id !== undefined && action.policy_id === agent.policy_id && (!agent.policy_revision || action.policy_revision > agent.policy_revision)), rateLimiter(), (0, _operators.concatMap)(policyAction => createAgentActionFromPolicyAction(soClient, esClient, agent, policyAction)), (0, _operators.merge)(newActions$), (0, _operators.concatMap)(data => {
      if (data === undefined) {
        return _rxjs.EMPTY;
      }

      const newActions = data.filter(action => action.agent_id === agent.id);

      if (newActions.length === 0) {
        return _rxjs.EMPTY;
      }

      const hasConfigReassign = newActions.some(action => action.type === 'INTERNAL_POLICY_REASSIGN');

      if (hasConfigReassign) {
        return (0, _rxjs.from)((0, _crud.getAgent)(soClient, esClient, agent.id)).pipe((0, _operators.concatMap)(refreshedAgent => {
          if (!refreshedAgent.policy_id) {
            throw new Error('Agent does not have a policy assigned');
          }

          const newAgentPolicy$ = getOrCreateAgentPolicyObservable(refreshedAgent.policy_id);
          return newAgentPolicy$;
        }), rateLimiter(), (0, _operators.concatMap)(policyAction => createAgentActionFromPolicyAction(soClient, esClient, agent, policyAction)));
      }

      return (0, _rxjs.of)(newActions);
    }), (0, _operators.filter)(data => data !== undefined), (0, _operators.take)(1));

    try {
      const data = await (0, _rxjs_utils.toPromiseAbortable)(stream$, options === null || options === void 0 ? void 0 : options.signal);
      return data || [];
    } catch (err) {
      if (err instanceof _rxjs.TimeoutError || err instanceof _rxjs_utils.AbortError) {
        return [];
      }

      throw err;
    }
  }

  return {
    subscribeToNewActions
  };
}