"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRepositoryEsClient = createRepositoryEsClient;

var _retry_call_cluster = require("../../../elasticsearch/client/retry_call_cluster");

var _decorate_es_error = require("./decorate_es_error");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const methods = ['bulk', 'closePointInTime', 'create', 'delete', 'get', 'index', 'mget', 'openPointInTime', 'search', 'update', 'updateByQuery'];

function createRepositoryEsClient(client) {
  return methods.reduce((acc, key) => {
    Object.defineProperty(acc, key, {
      value: async (params, options) => {
        try {
          return await (0, _retry_call_cluster.retryCallCluster)(() => client[key](params, {
            maxRetries: 0,
            ...options
          }));
        } catch (e) {
          throw (0, _decorate_es_error.decorateEsError)(e);
        }
      }
    });
    return acc;
  }, {});
}