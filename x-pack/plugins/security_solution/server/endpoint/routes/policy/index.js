"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPolicyRoutes = registerPolicyRoutes;
exports.INITIAL_POLICY_ID = void 0;

var _policy = require("../../../../common/endpoint/schema/policy");

var _handlers = require("./handlers");

var _constants = require("../../../../common/endpoint/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const INITIAL_POLICY_ID = '00000000-0000-0000-0000-000000000000';
exports.INITIAL_POLICY_ID = INITIAL_POLICY_ID;

function registerPolicyRoutes(router, endpointAppContext) {
  router.get({
    path: _constants.BASE_POLICY_RESPONSE_ROUTE,
    validate: _policy.GetPolicyResponseSchema,
    options: {
      authRequired: true
    }
  }, (0, _handlers.getHostPolicyResponseHandler)(endpointAppContext));
  router.get({
    path: _constants.AGENT_POLICY_SUMMARY_ROUTE,
    validate: _policy.GetAgentPolicySummaryRequestSchema,
    options: {
      authRequired: true
    }
  }, (0, _handlers.getAgentPolicySummaryHandler)(endpointAppContext));
}