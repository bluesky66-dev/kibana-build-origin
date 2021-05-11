"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLoadHistoryRoute = registerLoadHistoryRoute;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _shared_imports = require("../../shared_imports");

var _constants = require("../../../common/constants");

var _license_pre_routing_factory = require("../../lib/license_pre_routing_factory");

var _index = require("../../models/watch_history_item/index");
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

function fetchHistoryItem(dataClient, watchHistoryItemId) {
  return dataClient.callAsCurrentUser('search', {
    index: _constants.INDEX_NAMES.WATCHER_HISTORY,
    body: {
      query: {
        bool: {
          must: [{
            term: {
              _id: watchHistoryItemId
            }
          }]
        }
      }
    }
  });
}

function registerLoadHistoryRoute(deps) {
  deps.router.get({
    path: '/api/watcher/history/{id}',
    validate: {
      params: paramsSchema
    }
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, async (ctx, request, response) => {
    const id = request.params.id;

    try {
      const responseFromES = await fetchHistoryItem(ctx.watcher.client, id);
      const hit = (0, _lodash.get)(responseFromES, 'hits.hits[0]');

      if (!hit) {
        return response.notFound({
          body: `Watch History Item with id = ${id} not found`
        });
      }

      const watchHistoryItemJson = (0, _lodash.get)(hit, '_source');
      const watchId = (0, _lodash.get)(hit, '_source.watch_id');
      const json = {
        id,
        watchId,
        watchHistoryItemJson,
        includeDetails: true
      };

      const watchHistoryItem = _index.WatchHistoryItem.fromUpstreamJson(json);

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