"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _constants = require("../../constants");

var _types = require("../../types");

var _handlers = require("./handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerRoutes = router => {
  // List
  router.get({
    path: _constants.AGENT_POLICY_API_ROUTES.LIST_PATTERN,
    validate: _types.GetAgentPoliciesRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getAgentPoliciesHandler); // Get one

  router.get({
    path: _constants.AGENT_POLICY_API_ROUTES.INFO_PATTERN,
    validate: _types.GetOneAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getOneAgentPolicyHandler); // Create

  router.post({
    path: _constants.AGENT_POLICY_API_ROUTES.CREATE_PATTERN,
    validate: _types.CreateAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.createAgentPolicyHandler); // Update

  router.put({
    path: _constants.AGENT_POLICY_API_ROUTES.UPDATE_PATTERN,
    validate: _types.UpdateAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.updateAgentPolicyHandler); // Copy

  router.post({
    path: _constants.AGENT_POLICY_API_ROUTES.COPY_PATTERN,
    validate: _types.CopyAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.copyAgentPolicyHandler); // Delete

  router.post({
    path: _constants.AGENT_POLICY_API_ROUTES.DELETE_PATTERN,
    validate: _types.DeleteAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.deleteAgentPoliciesHandler); // Get one full agent policy

  router.get({
    path: _constants.AGENT_POLICY_API_ROUTES.FULL_INFO_PATTERN,
    validate: _types.GetFullAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getFullAgentPolicy); // Download one full agent policy

  router.get({
    path: _constants.AGENT_POLICY_API_ROUTES.FULL_INFO_DOWNLOAD_PATTERN,
    validate: _types.GetFullAgentPolicyRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.downloadFullAgentPolicy);
};

exports.registerRoutes = registerRoutes;