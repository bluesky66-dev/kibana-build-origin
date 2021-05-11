"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupFleetServerIndexes = setupFleetServerIndexes;
exports.createAliasIfDoNotExists = createAliasIfDoNotExists;

var _objectHash = _interopRequireDefault(require("object-hash"));

var _common = require("../../../common");

var _app_context = require("../app_context");

var _fleet_agents = _interopRequireDefault(require("./elasticsearch/fleet_agents.json"));

var _fleet_policies = _interopRequireDefault(require("./elasticsearch/fleet_policies.json"));

var _fleet_policies_leader = _interopRequireDefault(require("./elasticsearch/fleet_policies_leader.json"));

var _fleet_servers = _interopRequireDefault(require("./elasticsearch/fleet_servers.json"));

var _fleet_enrollment_api_keys = _interopRequireDefault(require("./elasticsearch/fleet_enrollment_api_keys.json"));

var _fleet_actions = _interopRequireDefault(require("./elasticsearch/fleet_actions.json"));

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


const FLEET_INDEXES = [['.fleet-actions', _fleet_actions.default], ['.fleet-agents', _fleet_agents.default], ['.fleet-enrollment-api-keys', _fleet_enrollment_api_keys.default], ['.fleet-policies', _fleet_policies.default], ['.fleet-policies-leader', _fleet_policies_leader.default], ['.fleet-servers', _fleet_servers.default]];

async function setupFleetServerIndexes(esClient = _app_context.appContextService.getInternalUserESClient()) {
  await Promise.all(FLEET_INDEXES.map(async ([indexAlias, indexData]) => {
    const index = `${indexAlias}_${_common.FLEET_SERVER_INDICES_VERSION}`;
    await createOrUpdateIndex(esClient, index, indexData);
    await createAliasIfDoNotExists(esClient, indexAlias, index);
  }));
}

async function createAliasIfDoNotExists(esClient, alias, index) {
  const {
    body: exists
  } = await esClient.indices.existsAlias({
    name: alias
  });

  if (exists === true) {
    return;
  }

  await esClient.indices.updateAliases({
    body: {
      actions: [{
        add: {
          index,
          alias
        }
      }]
    }
  });
}

async function createOrUpdateIndex(esClient, indexName, indexData) {
  const resExists = await esClient.indices.exists({
    index: indexName
  }); // Support non destructive migration only (adding new field)

  if (resExists.body === true) {
    return updateIndex(esClient, indexName, indexData);
  }

  return createIndex(esClient, indexName, indexData);
}

async function updateIndex(esClient, indexName, indexData) {
  var _res$body$indexName$m, _res$body$indexName$m2;

  const res = await esClient.indices.getMapping({
    index: indexName
  });
  const migrationHash = (0, _objectHash.default)(indexData);

  if (((_res$body$indexName$m = res.body[indexName].mappings) === null || _res$body$indexName$m === void 0 ? void 0 : (_res$body$indexName$m2 = _res$body$indexName$m._meta) === null || _res$body$indexName$m2 === void 0 ? void 0 : _res$body$indexName$m2.migrationHash) !== migrationHash) {
    await esClient.indices.putMapping({
      index: indexName,
      body: Object.assign({ ...indexData.mappings,
        _meta: { ...(indexData.mappings._meta || {}),
          migrationHash
        }
      })
    });
  }
}

async function createIndex(esClient, indexName, indexData) {
  try {
    const migrationHash = (0, _objectHash.default)(indexData);
    await esClient.indices.create({
      index: indexName,
      body: { ...indexData,
        mappings: Object.assign({ ...indexData.mappings,
          _meta: { ...(indexData.mappings._meta || {}),
            migrationHash
          }
        })
      }
    });
  } catch (err) {
    var _err$body, _err$body$error; // Swallow already exists errors as concurent Kibana can try to create that indice


    if ((err === null || err === void 0 ? void 0 : (_err$body = err.body) === null || _err$body === void 0 ? void 0 : (_err$body$error = _err$body.error) === null || _err$body$error === void 0 ? void 0 : _err$body$error.type) !== 'resource_already_exists_exception') {
      throw err;
    }
  }
}