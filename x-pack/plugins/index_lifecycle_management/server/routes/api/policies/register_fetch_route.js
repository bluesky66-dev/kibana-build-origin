"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFetchRoute = registerFetchRoute;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function formatPolicies(policiesMap) {
  return Object.keys(policiesMap).reduce((accum, lifecycleName) => {
    const policyEntry = policiesMap[lifecycleName];
    accum.push({ ...policyEntry,
      name: lifecycleName
    });
    return accum;
  }, []);
}

async function fetchPolicies(client) {
  const options = {
    // we allow 404 since they may have no policies
    ignore: [404]
  };
  return client.ilm.getLifecycle({}, options);
}

async function addLinkedIndices(client, policiesMap) {
  const options = {
    // we allow 404 since they may have no policies
    ignore: [404]
  };
  const response = await client.ilm.explainLifecycle({
    index: '*,.*'
  }, options); // '*,.*' will include hidden indices

  const policyExplanation = response.body;
  Object.entries(policyExplanation.indices).forEach(([indexName, {
    policy
  }]) => {
    if (policy && policiesMap[policy]) {
      policiesMap[policy].linkedIndices = policiesMap[policy].linkedIndices || [];
      policiesMap[policy].linkedIndices.push(indexName);
    }
  });
}

const querySchema = _configSchema.schema.object({
  withIndices: _configSchema.schema.boolean({
    defaultValue: false
  })
});

function registerFetchRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _services.addBasePath)('/policies'),
    validate: {
      query: querySchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const query = request.query;
    const {
      withIndices
    } = query;
    const {
      asCurrentUser
    } = context.core.elasticsearch.client;

    try {
      const policiesResponse = await fetchPolicies(asCurrentUser);

      if (policiesResponse.statusCode === 404) {
        return response.ok({
          body: []
        });
      }

      const {
        body: policiesMap
      } = policiesResponse;

      if (withIndices) {
        await addLinkedIndices(asCurrentUser, policiesMap);
      }

      return response.ok({
        body: formatPolicies(policiesMap)
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}