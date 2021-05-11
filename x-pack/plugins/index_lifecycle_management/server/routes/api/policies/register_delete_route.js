"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = registerDeleteRoute;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function deletePolicies(client, policyName) {
  const options = {
    // we allow 404 since they may have no policies
    ignore: [404]
  };
  return client.ilm.deleteLifecycle({
    policy: policyName
  }, options);
}

const paramsSchema = _configSchema.schema.object({
  policyNames: _configSchema.schema.string()
});

function registerDeleteRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.delete({
    path: (0, _services.addBasePath)('/policies/{policyNames}'),
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const params = request.params;
    const {
      policyNames
    } = params;

    try {
      await deletePolicies(context.core.elasticsearch.client.asCurrentUser, policyNames);
      return response.ok();
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}