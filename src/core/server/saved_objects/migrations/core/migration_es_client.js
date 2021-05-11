"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMigrationEsClient = createMigrationEsClient;

var _lodash = require("lodash");

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _retry_call_cluster = require("../../../elasticsearch/client/retry_call_cluster");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const methods = ['bulk', 'cat.templates', 'clearScroll', 'count', 'indices.create', 'indices.deleteTemplate', 'indices.get', 'indices.getAlias', 'indices.refresh', 'indices.updateAliases', 'reindex', 'search', 'scroll', 'tasks.get'];

function createMigrationEsClient(client, log, delay) {
  return methods.reduce((acc, key) => {
    (0, _saferLodashSet.set)(acc, key, async (params, options) => {
      const fn = (0, _lodash.get)(client, key);

      if (!fn) {
        throw new Error(`unknown ElasticsearchClient client method [${key}]`);
      }

      return await (0, _retry_call_cluster.migrationRetryCallCluster)(() => fn.call(client, params, {
        maxRetries: 0,
        ...options
      }), log, delay);
    });
    return acc;
  }, {});
}