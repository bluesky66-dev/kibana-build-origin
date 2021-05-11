"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRoute = registerCreateRoute;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function createPolicy(client, name, phases) {
  const body = {
    policy: {
      phases
    }
  };
  const options = {
    ignore: [404]
  };
  return client.ilm.putLifecycle({
    policy: name,
    body
  }, options);
}
/**
 * We intentionally do not deeply validate the posted policy object to avoid erroring on valid ES
 * policy configuration Kibana UI does not know or should not know about. For instance, the
 * `force_merge_index` setting of the `searchable_snapshot` action.
 *
 * We only specify a rough structure based on https://www.elastic.co/guide/en/elasticsearch/reference/current/_actions.html.
 */


const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  phases: _configSchema.schema.object({
    hot: _configSchema.schema.any(),
    warm: _configSchema.schema.maybe(_configSchema.schema.any()),
    cold: _configSchema.schema.maybe(_configSchema.schema.any()),
    delete: _configSchema.schema.maybe(_configSchema.schema.any())
  })
});

function registerCreateRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: (0, _services.addBasePath)('/policies'),
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const body = request.body;
    const {
      name,
      phases
    } = body;

    try {
      await createPolicy(context.core.elasticsearch.client.asCurrentUser, name, phases);
      return response.ok();
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}