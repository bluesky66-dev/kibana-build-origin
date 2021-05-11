"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeGetFunctionsRoute = initializeGetFunctionsRoute;
exports.initializeBatchFunctionsRoute = initializeBatchFunctionsRoute;

var _common = require("../../../../../../src/plugins/expressions/common");

var _constants = require("../../../common/lib/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initializeGetFunctionsRoute(deps) {
  const {
    router,
    expressions
  } = deps;
  router.get({
    path: _constants.API_ROUTE_FUNCTIONS,
    validate: false
  }, async (context, request, response) => {
    const functions = expressions.getFunctions();
    const body = JSON.stringify(functions);
    return response.ok({
      body
    });
  });
}

function initializeBatchFunctionsRoute(deps) {
  const {
    bfetch,
    elasticsearch,
    expressions
  } = deps;

  async function runFunction(handlers, fnCall) {
    const {
      functionName,
      args,
      context
    } = fnCall;
    const {
      deserialize
    } = (0, _common.serializeProvider)(expressions.getTypes());
    const fnDef = expressions.getFunctions()[functionName];
    if (!fnDef) throw new Error(`Function "${functionName}" could not be found.`);
    const deserialized = deserialize(context);
    const result = fnDef.fn(deserialized, args, handlers);
    return result;
  }
  /**
   * Register an endpoint that executes a batch of functions, and streams the
   * results back using ND-JSON.
   */


  bfetch.addBatchProcessingRoute(_constants.API_ROUTE_FUNCTIONS, request => {
    return {
      onBatchItem: async fnCall => {
        const handlers = {
          environment: 'server',
          elasticsearchClient: elasticsearch.legacy.client.asScoped(request).callAsCurrentUser
        };
        const result = await runFunction(handlers, fnCall);

        if (typeof result === 'undefined') {
          throw new Error(`Function ${fnCall.functionName} did not return anything.`);
        }

        return result;
      }
    };
  });
}