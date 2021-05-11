"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRetryRoute = registerRetryRoute;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function retryLifecycle(client, indexNames) {
  const options = {
    ignore: [404]
  };
  const responses = [];

  for (let i = 0; i < indexNames.length; i++) {
    const indexName = indexNames[i];
    responses.push(client.ilm.retry({
      index: indexName
    }, options));
  }

  return Promise.all(responses);
}

const bodySchema = _configSchema.schema.object({
  indexNames: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

function registerRetryRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: (0, _services.addBasePath)('/index/retry'),
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const body = request.body;
    const {
      indexNames
    } = body;

    try {
      await retryLifecycle(context.core.elasticsearch.client.asCurrentUser, indexNames);
      return response.ok();
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}