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

var _errors = require("@elastic/elasticsearch/lib/errors");

var _constants = require("../../constants");

var _security = require("./security");

var _agent_policy = require("../agent_policy");

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


async function listEnrollmentApiKeys(esClient, options) {
  const {
    page = 1,
    perPage = 20,
    kuery
  } = options;
  const res = await esClient.search({
    index: _constants.ENROLLMENT_API_KEYS_INDEX,
    from: (page - 1) * perPage,
    size: perPage,
    sort: 'created_at:desc',
    track_total_hits: true,
    q: kuery
  });
  const items = res.body.hits.hits.map(esDocToEnrollmentApiKey);
  return {
    items,
    total: res.body.hits.total.value,
    page,
    perPage
  };
}

async function getEnrollmentAPIKey(esClient, id) {
  try {
    const res = await esClient.get({
      index: _constants.ENROLLMENT_API_KEYS_INDEX,
      id
    });
    return esDocToEnrollmentApiKey(res.body);
  } catch (e) {
    if (e instanceof _errors.ResponseError && e.statusCode === 404) {
      throw _boom.default.notFound(`Enrollment api key ${id} not found`);
    }

    throw e;
  }
}
/**
 * Invalidate an api key and mark it as inactive
 * @param soClient
 * @param id
 */


async function deleteEnrollmentApiKey(soClient, esClient, id) {
  const enrollmentApiKey = await getEnrollmentAPIKey(esClient, id);
  await (0, _security.invalidateAPIKeys)(soClient, [enrollmentApiKey.api_key_id]);
  await esClient.update({
    index: _constants.ENROLLMENT_API_KEYS_INDEX,
    id,
    body: {
      doc: {
        active: false
      }
    },
    refresh: 'wait_for'
  });
}

async function deleteEnrollmentApiKeyForAgentPolicyId(soClient, agentPolicyId) {
  throw new Error('NOT IMPLEMENTED');
}

async function generateEnrollmentAPIKey(soClient, esClient, data) {
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
  const body = {
    active: true,
    api_key_id: key.id,
    api_key: apiKey,
    name,
    policy_id: agentPolicyId,
    created_at: new Date().toISOString()
  };
  const res = await esClient.create({
    index: _constants.ENROLLMENT_API_KEYS_INDEX,
    body,
    id,
    refresh: 'wait_for'
  });
  return {
    id: res.body._id,
    ...body
  };
}

async function getEnrollmentAPIKeyById(esClient, apiKeyId) {
  const res = await esClient.search({
    index: _constants.ENROLLMENT_API_KEYS_INDEX,
    q: `api_key_id:${(0, _saved_object.escapeSearchQueryPhrase)(apiKeyId)}`
  });
  const [enrollmentAPIKey] = res.body.hits.hits.map(esDocToEnrollmentApiKey);

  if ((enrollmentAPIKey === null || enrollmentAPIKey === void 0 ? void 0 : enrollmentAPIKey.api_key_id) !== apiKeyId) {
    throw new Error('find enrollmentKeyById returned an incorrect key');
  }

  return enrollmentAPIKey;
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

function esDocToEnrollmentApiKey(doc) {
  return {
    id: doc._id,
    ...doc._source,
    created_at: doc._source.created_at,
    active: doc._source.active || false
  };
}