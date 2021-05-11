"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runFleetServerMigration = runFleetServerMigration;

var _boom = require("@hapi/boom");

var _common = require("../../../common");

var _enrollment_api_key_so = require("../api_keys/enrollment_api_key_so");

var _app_context = require("../app_context");

var _agents = require("../agents");

var _agent_policy = require("../agent_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function runFleetServerMigration() {
  // If Agents are not setup skip as there is nothing to migrate
  if (!(await (0, _agents.isAgentsSetup)(getInternalUserSOClient()))) {
    return;
  }

  await Promise.all([migrateEnrollmentApiKeys(), migrateAgentPolicies(), migrateAgents()]);
}

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

async function migrateAgents() {
  const esClient = _app_context.appContextService.getInternalUserESClient();

  const soClient = getInternalUserSOClient();
  let hasMore = true;

  while (hasMore) {
    const res = await soClient.find({
      type: _common.AGENT_SAVED_OBJECT_TYPE,
      page: 1,
      perPage: 100
    });

    if (res.total === 0) {
      hasMore = false;
    }

    for (const so of res.saved_objects) {
      try {
        const {
          attributes
        } = await _app_context.appContextService.getEncryptedSavedObjects().getDecryptedAsInternalUser(_common.AGENT_SAVED_OBJECT_TYPE, so.id);
        const body = {
          type: attributes.type,
          active: attributes.active,
          enrolled_at: attributes.enrolled_at,
          unenrolled_at: attributes.unenrolled_at,
          unenrollment_started_at: attributes.unenrollment_started_at,
          upgraded_at: attributes.upgraded_at,
          upgrade_started_at: attributes.upgrade_started_at,
          access_api_key_id: attributes.access_api_key_id,
          user_provided_metadata: attributes.user_provided_metadata,
          local_metadata: attributes.local_metadata,
          policy_id: attributes.policy_id,
          policy_revision_idx: attributes.policy_revision || undefined,
          last_checkin: attributes.last_checkin,
          last_checkin_status: attributes.last_checkin_status,
          default_api_key_id: attributes.default_api_key_id,
          default_api_key: attributes.default_api_key,
          packages: attributes.packages
        };
        await esClient.create({
          index: _common.AGENTS_INDEX,
          body,
          id: so.id,
          refresh: 'wait_for'
        });
        await soClient.delete(_common.AGENT_SAVED_OBJECT_TYPE, so.id);
      } catch (error) {
        // swallow 404 error has multiple Kibana can run the migration at the same time
        if (!is404Error(error)) {
          throw error;
        }
      }
    }
  }
}

async function migrateEnrollmentApiKeys() {
  const esClient = _app_context.appContextService.getInternalUserESClient();

  const soClient = getInternalUserSOClient();
  let hasMore = true;

  while (hasMore) {
    const res = await (0, _enrollment_api_key_so.listEnrollmentApiKeys)(soClient, {
      page: 1,
      perPage: 100
    });

    if (res.total === 0) {
      hasMore = false;
    }

    for (const item of res.items) {
      try {
        const key = await (0, _enrollment_api_key_so.getEnrollmentAPIKey)(soClient, item.id);
        const body = {
          api_key: key.api_key,
          api_key_id: key.api_key_id,
          active: key.active,
          created_at: key.created_at,
          name: key.name,
          policy_id: key.policy_id
        };
        await esClient.create({
          index: _common.ENROLLMENT_API_KEYS_INDEX,
          body,
          id: key.id,
          refresh: 'wait_for'
        });
        await soClient.delete(_common.ENROLLMENT_API_KEYS_SAVED_OBJECT_TYPE, key.id);
      } catch (error) {
        // swallow 404 error has multiple Kibana can run the migration at the same time
        if (!is404Error(error)) {
          throw error;
        }
      }
    }
  }
}

async function migrateAgentPolicies() {
  const esClient = _app_context.appContextService.getInternalUserESClient();

  const soClient = getInternalUserSOClient();
  const {
    items: agentPolicies
  } = await _agent_policy.agentPolicyService.list(soClient, {
    perPage: _common.SO_SEARCH_LIMIT
  });
  await Promise.all(agentPolicies.map(async agentPolicy => {
    const res = await esClient.search({
      index: _common.AGENT_POLICY_INDEX,
      q: `policy_id:${agentPolicy.id}`,
      track_total_hits: true
    });

    if (res.body.hits.total.value === 0) {
      return _agent_policy.agentPolicyService.createFleetPolicyChangeFleetServer(soClient, esClient, agentPolicy.id);
    }
  }));
}

function is404Error(error) {
  return (0, _boom.isBoom)(error) && error.output.statusCode === 404;
}