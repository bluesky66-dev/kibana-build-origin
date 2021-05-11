"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAcknowledgeRoute = registerAcknowledgeRoute;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _shared_imports = require("../../../../shared_imports");

var _index = require("../../../../models/watch_status/index");

var _license_pre_routing_factory = require("../../../../lib/license_pre_routing_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


const paramsSchema = _configSchema.schema.object({
  watchId: _configSchema.schema.string(),
  actionId: _configSchema.schema.string()
});

function acknowledgeAction(dataClient, watchId, actionId) {
  return dataClient.callAsCurrentUser('watcher.ackWatch', {
    id: watchId,
    action: actionId
  });
}

function registerAcknowledgeRoute(deps) {
  deps.router.put({
    path: '/api/watcher/watch/{watchId}/action/{actionId}/acknowledge',
    validate: {
      params: paramsSchema
    }
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, async (ctx, request, response) => {
    const {
      watchId,
      actionId
    } = request.params;

    try {
      const hit = await acknowledgeAction(ctx.watcher.client, watchId, actionId);
      const watchStatusJson = (0, _lodash.get)(hit, 'status');
      const json = {
        id: watchId,
        watchStatusJson
      };

      const watchStatus = _index.WatchStatus.fromUpstreamJson(json);

      return response.ok({
        body: {
          watchStatus: watchStatus.downstreamJson
        }
      });
    } catch (e) {
      // Case: Error from Elasticsearch JS client
      if ((0, _shared_imports.isEsError)(e)) {
        const body = e.statusCode === 404 ? `Watch with id = ${watchId} not found` : e;
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