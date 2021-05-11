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

var _uuid = _interopRequireDefault(require("uuid"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _constants = require("../../constants");

var _security = require("./security");

var _agent_policy = require("../agent_policy");

var _app_context = require("../app_context");

var _saved_object = require("../saved_object");

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


async function listEnrollmentApiKeys(soClient, options) {
  const {
    page = 1,
    perPage = 20,
    kuery
  } = options; // eslint-disable-next-line @typescript-eslint/naming-convention

  const {
    saved_objects,
    total
  } = await soClient.find({
    type: _constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE,
    page,
    perPage,
    sortField: 'created_at',
    sortOrder: 'desc',
    filter: kuery && kuery !== '' ? (0, _saved_object.normalizeKuery)(_constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE, kuery) : undefined
  });
  const items = saved_objects.map(savedObjectToEnrollmentApiKey);
  return {
    items,
    total,
    page,
    perPage
  };
}

async function getEnrollmentAPIKey(soClient, id) {
  const so = await _app_context.appContextService.getEncryptedSavedObjects().getDecryptedAsInternalUser(_constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE, id);
  return savedObjectToEnrollmentApiKey(so);
}
/**
 * Invalidate an api key and mark it as inactive
 * @param soClient
 * @param id
 */


async function deleteEnrollmentApiKey(soClient, id) {
  const enrollmentApiKey = await getEnrollmentAPIKey(soClient, id);
  await (0, _security.invalidateAPIKeys)(soClient, [enrollmentApiKey.api_key_id]);
  await soClient.update(_constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE, id, {
    active: false
  });
}

async function deleteEnrollmentApiKeyForAgentPolicyId(soClient, agentPolicyId) {
  let hasMore = true;
  let page = 1;

  while (hasMore) {
    const {
      items
    } = await listEnrollmentApiKeys(soClient, {
      page: page++,
      perPage: 100,
      kuery: `${_constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE}.policy_id:${agentPolicyId}`
    });

    if (items.length === 0) {
      hasMore = false;
    }

    for (const apiKey of items) {
      await deleteEnrollmentApiKey(soClient, apiKey.id);
    }
  }
}

async function generateEnrollmentAPIKey(soClient, data) {
  var _data$agentPolicyId;

  const id = _uuid.default.v4();

  const {
    name: providedKeyName
  } = data;

  if (data.agentPolicyId) {
    await validateAgentPolicyId(soClient, data.agentPolicyId);
  }

  const agentPolicyId = (_data$agentPolicyId = data.agentPolicyId) !== null && _data$agentPolicyId !== void 0 ? _data$agentPolicyId : await _agent_policy.agentPolicyService.getDefaultAgentPolicyId(soClient);
  const name = providedKeyName ? `${providedKeyName} (${id})` : id;
  const key = await (0, _security.createAPIKey)(soClient, name, {
    // Useless role to avoid to have the privilege of the user that created the key
    'fleet-apikey-enroll': {
      cluster: [],
      applications: [{
        application: '.fleet',
        privileges: ['no-privileges'],
        resources: ['*']
      }]
    }
  });

  if (!key) {
    throw new Error('Unable to create an enrollment api key');
  }

  const apiKey = Buffer.from(`${key.id}:${key.api_key}`).toString('base64');
  const so = await soClient.create(_constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE, {
    active: true,
    api_key_id: key.id,
    api_key: apiKey,
    name,
    policy_id: agentPolicyId,
    created_at: new Date().toISOString()
  });
  return getEnrollmentAPIKey(soClient, so.id);
}

async function validateAgentPolicyId(soClient, agentPolicyId) {
  try {
    await _agent_policy.agentPolicyService.get(soClient, agentPolicyId);
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 404) {
      throw _boom.default.badRequest(`Agent policy ${agentPolicyId} does not exist`);
    }

    throw e;
  }
}

async function getEnrollmentAPIKeyById(soClient, apiKeyId) {
  const [enrollmentAPIKey] = (await soClient.find({
    type: _constants.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE,
    searchFields: ['api_key_id'],
    search: (0, _saved_object.escapeSearchQueryPhrase)(apiKeyId)
  })).saved_objects.map(savedObjectToEnrollmentApiKey);

  if ((enrollmentAPIKey === null || enrollmentAPIKey === void 0 ? void 0 : enrollmentAPIKey.api_key_id) !== apiKeyId) {
    throw new Error('find enrollmentKeyById returned an incorrect key');
  }

  return enrollmentAPIKey;
}

function savedObjectToEnrollmentApiKey({
  error,
  attributes,
  id
}) {
  if (error) {
    throw new Error(error.message);
  }

  return {
    id,
    ...attributes
  };
}