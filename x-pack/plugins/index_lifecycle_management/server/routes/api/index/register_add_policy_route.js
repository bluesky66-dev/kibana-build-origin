"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAddPolicyRoute = registerAddPolicyRoute;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function addLifecyclePolicy(client, indexName, policyName, alias) {
  const body = {
    lifecycle: {
      name: policyName,
      rollover_alias: alias
    }
  };
  return client.indices.putSettings({
    index: indexName,
    body
  });
}

const bodySchema = _configSchema.schema.object({
  indexName: _configSchema.schema.string(),
  policyName: _configSchema.schema.string(),
  alias: _configSchema.schema.maybe(_configSchema.schema.string())
});

function registerAddPolicyRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: (0, _services.addBasePath)('/index/add'),
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const body = request.body;
    const {
      indexName,
      policyName,
      alias = ''
    } = body;

    try {
      await addLifecyclePolicy(context.core.elasticsearch.client.asCurrentUser, indexName, policyName, alias);
      return response.ok();
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}