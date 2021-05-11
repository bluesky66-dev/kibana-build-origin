"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerExecuteRoute = registerExecuteRoute;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _shared_imports = require("../../../shared_imports");

var _license_pre_routing_factory = require("../../../lib/license_pre_routing_factory");

var _index = require("../../../models/execute_details/index");

var _index2 = require("../../../models/watch/index");

var _index3 = require("../../../models/watch_history_item/index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore


const bodySchema = _configSchema.schema.object({
  executeDetails: _configSchema.schema.object({}, {
    unknowns: 'allow'
  }),
  watch: _configSchema.schema.object({}, {
    unknowns: 'allow'
  })
});

function executeWatch(dataClient, executeDetails, watchJson) {
  const body = executeDetails;
  body.watch = watchJson;
  return dataClient.callAsCurrentUser('watcher.executeWatch', {
    body
  });
}

function registerExecuteRoute(deps) {
  deps.router.put({
    path: '/api/watcher/watch/execute',
    validate: {
      body: bodySchema
    }
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, async (ctx, request, response) => {
    const executeDetails = _index.ExecuteDetails.fromDownstreamJson(request.body.executeDetails);

    const watch = _index2.Watch.fromDownstreamJson(request.body.watch);

    try {
      const hit = await executeWatch(ctx.watcher.client, executeDetails.upstreamJson, watch.watchJson);
      const id = (0, _lodash.get)(hit, '_id');
      const watchHistoryItemJson = (0, _lodash.get)(hit, 'watch_record');
      const watchId = (0, _lodash.get)(hit, 'watch_record.watch_id');
      const json = {
        id,
        watchId,
        watchHistoryItemJson,
        includeDetails: true
      };

      const watchHistoryItem = _index3.WatchHistoryItem.fromUpstreamJson(json);

      return response.ok({
        body: {
          watchHistoryItem: watchHistoryItem.downstreamJson
        }
      });
    } catch (e) {
      // Case: Error from Elasticsearch JS client
      if ((0, _shared_imports.isEsError)(e)) {
        return response.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return response.internalError({
        body: e
      });
    }
  }));
}