"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInternalESClient = createInternalESClient;

var _server = require("../../../../../../observability/server");

var _call_async_with_debug = require("../call_async_with_debug");

var _cancel_es_request_on_abort = require("../cancel_es_request_on_abort");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createInternalESClient({
  context,
  request
}) {
  const {
    asInternalUser
  } = context.core.elasticsearch.client;

  function callEs({
    cb,
    operationName,
    params
  }) {
    return (0, _call_async_with_debug.callAsyncWithDebug)({
      cb: () => (0, _server.unwrapEsResponse)((0, _cancel_es_request_on_abort.cancelEsRequestOnAbort)(cb(), request)),
      getDebugMessage: () => ({
        title: (0, _call_async_with_debug.getDebugTitle)(request),
        body: (0, _call_async_with_debug.getDebugBody)(params, operationName)
      }),
      debug: context.params.query._debug
    });
  }

  return {
    search: async params => {
      return callEs({
        operationName: 'search',
        cb: () => asInternalUser.search(params),
        params
      });
    },
    index: params => {
      return callEs({
        operationName: 'index',
        cb: () => asInternalUser.index(params),
        params
      });
    },
    delete: params => {
      return callEs({
        operationName: 'delete',
        cb: () => asInternalUser.delete(params),
        params
      });
    },
    indicesCreate: params => {
      return callEs({
        operationName: 'indices.create',
        cb: () => asInternalUser.indices.create(params),
        params
      });
    }
  };
}