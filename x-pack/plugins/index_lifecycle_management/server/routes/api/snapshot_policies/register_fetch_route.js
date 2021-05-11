"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFetchRoute = registerFetchRoute;

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchSnapshotPolicies(client) {
  const response = await client.slm.getLifecycle();
  return response.body;
}

function registerFetchRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _services.addBasePath)('/snapshot_policies'),
    validate: false
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const policiesByName = await fetchSnapshotPolicies(context.core.elasticsearch.client.asCurrentUser);
      return response.ok({
        body: Object.keys(policiesByName)
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}