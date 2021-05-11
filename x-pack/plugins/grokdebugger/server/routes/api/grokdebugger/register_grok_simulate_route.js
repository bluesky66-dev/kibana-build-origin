"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGrokSimulateRoute = registerGrokSimulateRoute;

var _configSchema = require("@kbn/config-schema");

var _grokdebugger_request = require("../../../models/grokdebugger_request");

var _grokdebugger_response = require("../../../models/grokdebugger_response");

var _shared_imports = require("../../../shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore


const requestBodySchema = _configSchema.schema.object({
  pattern: _configSchema.schema.string(),
  rawEvent: _configSchema.schema.string(),
  // We don't know these key / values up front as they depend on user input
  customPatterns: _configSchema.schema.object({}, {
    unknowns: 'allow'
  })
});

function registerGrokSimulateRoute(framework) {
  framework.registerRoute({
    method: 'post',
    path: '/api/grokdebugger/simulate',
    validate: {
      body: requestBodySchema
    }
  }, async (requestContext, request, response) => {
    try {
      const grokdebuggerRequest = _grokdebugger_request.GrokdebuggerRequest.fromDownstreamJSON(request.body);

      const simulateResponseFromES = await requestContext.core.elasticsearch.client.asCurrentUser.ingest.simulate({
        body: grokdebuggerRequest.upstreamJSON
      });

      const grokdebuggerResponse = _grokdebugger_response.GrokdebuggerResponse.fromUpstreamJSON(simulateResponseFromES.body);

      return response.ok({
        body: grokdebuggerResponse
      });
    } catch (error) {
      return (0, _shared_imports.handleEsError)({
        error,
        response
      });
    }
  });
}