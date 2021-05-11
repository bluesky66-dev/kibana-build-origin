"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLoadRoute = registerLoadRoute;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _shared_imports = require("../../../shared_imports");

var _license_pre_routing_factory = require("../../../lib/license_pre_routing_factory");

var _index = require("../../../models/watch/index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


const paramsSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});

function fetchWatch(dataClient, watchId) {
  return dataClient.callAsCurrentUser('watcher.getWatch', {
    id: watchId
  });
}

function registerLoadRoute(deps) {
  deps.router.get({
    path: '/api/watcher/watch/{id}',
    validate: {
      params: paramsSchema
    }
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, async (ctx, request, response) => {
    const id = request.params.id;

    try {
      const hit = await fetchWatch(ctx.watcher.client, id);
      const watchJson = (0, _lodash.get)(hit, 'watch');
      const watchStatusJson = (0, _lodash.get)(hit, 'status');
      const json = {
        id,
        watchJson,
        watchStatusJson
      };

      const watch = _index.Watch.fromUpstreamJson(json, {
        throwExceptions: {
          Action: false
        }
      });

      return response.ok({
        body: {
          watch: watch.downstreamJson
        }
      });
    } catch (e) {
      // Case: Error from Elasticsearch JS client
      if ((0, _shared_imports.isEsError)(e)) {
        const body = e.statusCode === 404 ? `Watch with id = ${id} not found` : e;
        return response.customError({
          statusCode: e.statusCode,
          body
        });
      } // Case: default


      return response.internalError({
        body: e
      });
    }
  }));
}