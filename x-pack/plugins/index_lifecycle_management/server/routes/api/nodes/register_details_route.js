"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDetailsRoute = registerDetailsRoute;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function findMatchingNodes(stats, nodeAttrs) {
  return Object.entries(stats.nodes).reduce((accum, [nodeId, nodeStats]) => {
    const attributes = nodeStats.attributes || {};

    for (const [key, value] of Object.entries(attributes)) {
      if (`${key}:${value}` === nodeAttrs) {
        accum.push({
          nodeId,
          stats: nodeStats
        });
        break;
      }
    }

    return accum;
  }, []);
}

const paramsSchema = _configSchema.schema.object({
  nodeAttrs: _configSchema.schema.string()
});

function registerDetailsRoute({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _services.addBasePath)('/nodes/{nodeAttrs}/details'),
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const params = request.params;
    const {
      nodeAttrs
    } = params;

    try {
      const statsResponse = await context.core.elasticsearch.client.asCurrentUser.nodes.stats();
      const okResponse = {
        body: findMatchingNodes(statsResponse.body, nodeAttrs)
      };
      return response.ok(okResponse);
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}